//! macOS app lifecycle for UwUSuite Tauri apps (docs/macos.md): quitting from
//! the Dock, ⌘Q in the app switcher, logging out or shutting down saves first.
//!
//! On macOS the system can end the app without ever asking the window: it
//! sends `terminate:` to the app, and tao answers that by ending the event loop
//! on the spot, so nothing would be written. [`install_quit_guard`] gives the
//! app's delegate an `applicationShouldTerminate:` of its own. The first time
//! it answers "later" and calls `ask`, which tells the page (an event, by
//! convention [`QUIT_EVENT`]). The page runs the same close path as the
//! window's close button and then answers through [`reply_quit`], which tells
//! macOS to go ahead, or not when the person chose to stay. A logout waits for
//! that answer instead of being cancelled. The page side is `onMacQuit` in
//! `@uwusuite/design/tauri`.
//!
//! ```ignore
//! // setup:
//! let handle = app.handle().clone();
//! uwu_macos::install_quit_guard(move || handle.emit(uwu_macos::QUIT_EVENT, ()).is_ok())?;
//!
//! #[tauri::command]
//! fn finish_quit(proceed: bool) {
//!     uwu_macos::reply_quit(proceed);
//! }
//! ```
//!
//! Off macOS both functions do nothing: logging out closes the window there,
//! which runs the page's own guard. From UwUNotes 0.6 (`quit.rs`).

use std::sync::atomic::{AtomicBool, Ordering};
use std::time::Duration;

/// The event the page answers by running its close path.
pub const QUIT_EVENT: &str = "quit-requested";

/// How long a quit waits for the page before it goes ahead anyway. Apps save
/// continuously, so the worst case is the last few keystrokes, never a quit
/// that hangs a logout.
pub const PATIENCE: Duration = Duration::from_secs(10);

/// Why the guard could not be installed. The app still quits, without saving first.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum InstallError {
    /// Called twice.
    AlreadyInstalled,
    /// `NSApplication` has no delegate yet: call it from Tauri's `setup`.
    NoDelegate,
    /// The delegate already answers `applicationShouldTerminate:`.
    DelegateAnswers,
}

impl std::fmt::Display for InstallError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(match self {
            Self::AlreadyInstalled => "the quit guard is already installed",
            Self::NoDelegate => "no app delegate; quitting from the Dock will not save first",
            Self::DelegateAnswers => "the app delegate already answers applicationShouldTerminate:",
        })
    }
}

impl std::error::Error for InstallError {}

/// What `applicationShouldTerminate:` answers.
// Only AppKit asks; off macOS the tests still run the logic.
#[cfg_attr(not(target_os = "macos"), allow(dead_code))]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Decision {
    Now,
    /// Wait for the page. `asked` is true the first time, when the patience
    /// timer starts.
    Later {
        asked: bool,
    },
}

/// The quit's state, apart from AppKit so it is tested on every platform.
struct Gate {
    /// A quit is waiting for the page's answer.
    pending: AtomicBool,
    /// The page has saved and said yes: any further `terminate:` goes through.
    allowed: AtomicBool,
}

#[cfg_attr(not(target_os = "macos"), allow(dead_code))]
impl Gate {
    const fn new() -> Self {
        Self {
            pending: AtomicBool::new(false),
            allowed: AtomicBool::new(false),
        }
    }

    fn should_terminate(&self, ask: impl FnOnce() -> bool) -> Decision {
        if self.allowed.load(Ordering::SeqCst) {
            return Decision::Now;
        }
        // Asked twice while the page is still saving: the first question is
        // still open, so the answer is the same and the page is not asked again.
        if self.pending.swap(true, Ordering::SeqCst) {
            return Decision::Later { asked: false };
        }
        if !ask() {
            // Nobody to ask means nobody to wait for.
            self.pending.store(false, Ordering::SeqCst);
            return Decision::Now;
        }
        Decision::Later { asked: true }
    }

    /// The page's answer. `Some` when a quit was waiting for it.
    fn reply(&self, proceed: bool) -> Option<bool> {
        if !self.pending.swap(false, Ordering::SeqCst) {
            return None;
        }
        if proceed {
            self.allowed.store(true, Ordering::SeqCst);
        }
        Some(proceed)
    }

    /// The patience ran out. True when a quit was still waiting, which then goes ahead.
    fn time_out(&self) -> bool {
        if !self.pending.swap(false, Ordering::SeqCst) {
            return false;
        }
        self.allowed.store(true, Ordering::SeqCst);
        true
    }
}

static GATE: Gate = Gate::new();

/// Hooks the app delegate so a quit from outside the window asks the page
/// first. Call it once from Tauri's `setup`, on the main thread. `ask` tells
/// the page and returns whether that worked. Does nothing off macOS.
pub fn install_quit_guard<F>(ask: F) -> Result<(), InstallError>
where
    F: Fn() -> bool + Send + Sync + 'static,
{
    #[cfg(target_os = "macos")]
    return mac::install(Box::new(ask));
    #[cfg(not(target_os = "macos"))]
    {
        let _ = ask;
        Ok(())
    }
}

/// The page's answer to [`QUIT_EVENT`]: `true` after it saved, `false` when
/// the person decided to stay. Does nothing when no quit is waiting, and
/// nothing at all off macOS.
pub fn reply_quit(proceed: bool) {
    if let Some(proceed) = GATE.reply(proceed) {
        #[cfg(target_os = "macos")]
        mac::answer_on_main_queue(proceed);
        #[cfg(not(target_os = "macos"))]
        let _ = proceed;
    }
}

#[cfg(target_os = "macos")]
mod mac {
    use std::sync::OnceLock;

    use objc2::runtime::{AnyClass, AnyObject, Bool, Imp, Sel};
    use objc2::{class, msg_send, sel};

    use super::{Decision, InstallError, GATE, PATIENCE};

    /// `NSApplicationTerminateReply`, an `NSUInteger`.
    const TERMINATE_NOW: usize = 1;
    const TERMINATE_LATER: usize = 2;

    type Ask = Box<dyn Fn() -> bool + Send + Sync>;
    static ASK: OnceLock<Ask> = OnceLock::new();

    type ShouldTerminate =
        unsafe extern "C-unwind" fn(*mut AnyObject, Sel, *mut AnyObject) -> usize;

    unsafe extern "C-unwind" fn should_terminate(
        _this: *mut AnyObject,
        _cmd: Sel,
        _sender: *mut AnyObject,
    ) -> usize {
        let Some(ask) = ASK.get() else {
            return TERMINATE_NOW;
        };
        match GATE.should_terminate(ask) {
            Decision::Now => TERMINATE_NOW,
            Decision::Later { asked } => {
                if asked {
                    start_patience_timer();
                }
                TERMINATE_LATER
            }
        }
    }

    pub(super) fn install(ask: Ask) -> Result<(), InstallError> {
        ASK.set(ask).map_err(|_| InstallError::AlreadyInstalled)?;
        // SAFETY: called on the main thread from `setup`, after tao has set
        // its delegate. The method is added to the delegate's own class, which
        // does not implement `applicationShouldTerminate:` (tao only has
        // `applicationWillTerminate:`), with the type encoding of
        // `- (NSApplicationTerminateReply)applicationShouldTerminate:(NSApplication *)`.
        unsafe {
            let ns_app: *mut AnyObject = msg_send![class!(NSApplication), sharedApplication];
            if ns_app.is_null() {
                return Err(InstallError::NoDelegate);
            }
            let delegate: *mut AnyObject = msg_send![ns_app, delegate];
            if delegate.is_null() {
                return Err(InstallError::NoDelegate);
            }
            let class: &AnyClass = (*delegate).class();
            let imp = std::mem::transmute::<ShouldTerminate, Imp>(should_terminate);
            let added = objc2::ffi::class_addMethod(
                (class as *const AnyClass).cast_mut(),
                sel!(applicationShouldTerminate:),
                imp,
                c"Q@:@".as_ptr(),
            );
            if !added.as_bool() {
                return Err(InstallError::DelegateAnswers);
            }
        }
        Ok(())
    }

    fn start_patience_timer() {
        std::thread::spawn(|| {
            std::thread::sleep(PATIENCE);
            if GATE.time_out() {
                answer_on_main_queue(true);
            }
        });
    }

    // While a `terminate:` waits for its answer, AppKit runs the main run loop
    // in `NSModalPanelRunLoopMode`. Tao's own event-loop proxy (what
    // `run_on_main_thread` uses) may not be serviced in that mode; the main
    // dispatch queue is, in every common mode. So the answer goes through GCD.
    #[repr(C)]
    struct DispatchQueue {
        _private: [u8; 0],
    }
    extern "C" {
        static _dispatch_main_q: DispatchQueue;
        fn dispatch_async_f(
            queue: *const DispatchQueue,
            context: *mut std::ffi::c_void,
            work: extern "C" fn(*mut std::ffi::c_void),
        );
    }

    extern "C" fn answer(context: *mut std::ffi::c_void) {
        let proceed = !context.is_null();
        // SAFETY: on the main queue, i.e. the main thread, with a quit waiting.
        unsafe {
            let ns_app: *mut AnyObject = msg_send![class!(NSApplication), sharedApplication];
            let _: () = msg_send![ns_app, replyToApplicationShouldTerminate: Bool::new(proceed)];
        }
    }

    pub(super) fn answer_on_main_queue(proceed: bool) {
        // The flag travels as a null or non-null context pointer.
        let context = if proceed {
            std::ptr::dangling_mut::<u8>().cast()
        } else {
            std::ptr::null_mut()
        };
        // SAFETY: `_dispatch_main_q` is libdispatch's main queue, part of libSystem.
        unsafe { dispatch_async_f(&raw const _dispatch_main_q, context, answer) };
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_first_quit_asks_the_page_and_waits() {
        let gate = Gate::new();
        let mut asked = 0;
        assert_eq!(
            gate.should_terminate(|| {
                asked += 1;
                true
            }),
            Decision::Later { asked: true }
        );
        // A second terminate: while the page saves does not ask again.
        assert_eq!(
            gate.should_terminate(|| unreachable!()),
            Decision::Later { asked: false }
        );
        assert_eq!(asked, 1);
    }

    #[test]
    fn yes_lets_every_later_quit_through() {
        let gate = Gate::new();
        gate.should_terminate(|| true);
        assert_eq!(gate.reply(true), Some(true));
        assert_eq!(gate.should_terminate(|| unreachable!()), Decision::Now);
    }

    #[test]
    fn no_keeps_the_app_and_asks_again_next_time() {
        let gate = Gate::new();
        gate.should_terminate(|| true);
        assert_eq!(gate.reply(false), Some(false));
        assert_eq!(
            gate.should_terminate(|| true),
            Decision::Later { asked: true }
        );
    }

    #[test]
    fn an_answer_without_a_quit_does_nothing() {
        let gate = Gate::new();
        assert_eq!(gate.reply(true), None);
        assert_eq!(
            gate.should_terminate(|| true),
            Decision::Later { asked: true }
        );
    }

    #[test]
    fn nobody_to_ask_quits_now() {
        let gate = Gate::new();
        assert_eq!(gate.should_terminate(|| false), Decision::Now);
        assert_eq!(gate.reply(true), None);
    }

    #[test]
    fn running_out_of_patience_quits() {
        let gate = Gate::new();
        assert!(!gate.time_out());
        gate.should_terminate(|| true);
        assert!(gate.time_out());
        // The page's late answer finds nothing waiting.
        assert_eq!(gate.reply(false), None);
        assert_eq!(gate.should_terminate(|| unreachable!()), Decision::Now);
    }

    #[test]
    fn off_macos_installing_is_harmless() {
        #[cfg(not(target_os = "macos"))]
        assert_eq!(install_quit_guard(|| true), Ok(()));
    }
}
