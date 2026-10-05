# Tone of voice

The suite is **playful by default**: kaomoji, warm little jokes, soft
animations. A tone setting (Darstellung → Ton: Verspielt · Neutral) switches
the words only, never the layout or colours. German is the source language,
and we say "du".

## Rules

1. **Information first.** The joke never replaces what happened or what to do.
   "Nicht gesendet (╥﹏╥) Der Server sagt, das Passwort stimmt nicht." — not just
   a sad face.
2. **Short.** One kaomoji at most per message, never in buttons that act on
   data. Delete, Send and Save stay plain verbs.
3. **Kind.** Never mock the person; the app laughs at itself.
4. **Plain about safety.** Anything about who may connect, what is shared or
   what gets deleted is said plainly, in both tones.
5. **Always both.** Every string exists in neutral. The playful variant is
   optional and falls back to neutral. A test makes sure German and English
   define the same keys.

## Examples

| Situation   | Neutral                                               | Verspielt                                                         |
| ----------- | ----------------------------------------------------- | ----------------------------------------------------------------- |
| Empty inbox | Du bist auf dem neuesten Stand.                       | Posteingang leer! Zeit für einen Tee (っ˘ω˘ς)                     |
| Sent        | Nachricht gesendet.                                   | Und weg ist sie ✉︎ ~                                               |
| Offline     | Du bist offline. Gespeicherte Mails werden angezeigt. | Kein Internet (・_・;) Ich zeig dir, was ich gespeichert hab.     |
| Error       | Nicht gesendet: Der Server lehnt das Passwort ab.     | Nicht gesendet (╥﹏╥) Der Server sagt, das Passwort stimmt nicht. |
| Deleted     | In den Papierkorb verschoben.                         | Tschüss (｡•́︿•̀｡)                                                  |
| Ready       | Empfangsbereit als „Wohnzimmer“.                      | Bereit zum Spiegeln als „Wohnzimmer“ ✨                           |

## Typography in copy

- German quotes „…“ and ‚…‘, English quotes "…".
- The en dash – as a separator and the ellipsis … as one character.
- Put a narrow no-break space before units (`7000 ms`).
- Wrap playful strings with `keepKaomojiTogether()` when they load, so a face
  never breaks across lines.
- Write placeholders as `{name}`, never by concatenating strings.

## i18n

- **Source and English:** German is the source and English is required.
  UwUMail's web apps also ship fr, nl, ja and zh.
- **Language setting:** System · Deutsch · English. System picks German when
  the first system language starts with `de`.
- **Untranslated strings** stay German. A lint step lists them.
