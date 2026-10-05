# UwU Sans

The interface font of the UwUSuite: [Atkinson Hyperlegible Next](https://github.com/googlefonts/atkinson-hyperlegible-next)
with its letters untouched, plus Nyu (U+E000), a heart (U+2665), arrows
(U+2190-2193) and `calt` ligatures for `:3` and `<3`. Variable, weight
200-800, about 48 KB as WOFF2. License: SIL OFL 1.1 ([OFL.txt](OFL.txt)),
changes in [FONTLOG.txt](FONTLOG.txt).

## What changed

- Renamed per the OFL (family `UwU Sans`), MinifyX copyright line added.
- Subset to Latin, Latin Extended, punctuation, currency, arrows.
- New glyphs Nyu, heart and arrows, drawn as code in `build.py` with
  variation deltas so their stroke follows the weight.
- `:3` turns into Nyu and `<3` into a heart, but never next to a letter or
  digit: `10:30`, `9:30`, `3:33`, `x<3`, `1<35`, `3<3`, `a<3b` stay as they
  are. Turn it off with `font-variant-ligatures: no-contextual` (the app does
  this in the composer, address and search fields, code and pre).
- Nothing else: letter shapes, spacing, kerning and `tnum` are upstream's.

## Build

```sh
cd fonts/uwu-sans-source
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python build.py --install   # downloads + verifies upstream, writes UwUSans[wght].woff2,
                                      # copies it to fonts/ (the shipped file)
.venv/bin/python test_ligatures.py    # shaping tests (HarfBuzz)
.venv/bin/python specimen.py proof.png
```

The build is deterministic: the same inputs give a byte-identical WOFF2.
Upstream is pinned by commit and SHA-256 in `build.py`.

## Where it ships

`fonts/UwUSans[wght].woff2` is the one copy every UwUSuite app uses, through
`@uwusuite/design/fonts.css`. Apps must not keep their own copy. After a
rebuild, release a new version of the package and bump it in the apps.

Source history: the font was made for UwUMail (UwUMail-Client
`brand/fonts/uwu-sans`, 2026-10-02) and moved here unchanged.
