# UwU Sans

The interface font of the UwUSuite: [Atkinson Hyperlegible Next](https://github.com/googlefonts/atkinson-hyperlegible-next)
with its letters untouched, plus Nyu (U+E000), a heart (U+2665), arrows
(U+2190-2193). Variable, weight
200-800, about 48 KB as WOFF2. License: SIL OFL 1.1 ([OFL.txt](OFL.txt)),
changes in [FONTLOG.txt](FONTLOG.txt).

## What changed

- Renamed per the OFL (family `UwU Sans`), MinifyX copyright line added.
- Subset to Latin, Latin Extended, punctuation, currency, arrows.
- New glyphs Nyu, heart and arrows, drawn as code in `build.py` with
  variation deltas so their stroke follows the weight.
- No ligatures. Nyu and the heart only appear where their code point is
  used; `:3` and `<3` stay as typed. (1.000 turned them into Nyu and a heart
  with `calt`; 1.100 dropped that because it changed what the symbols mean.)
- Nothing else: letter shapes, spacing, kerning and `tnum` are upstream's.

## Build

```sh
cd fonts/uwu-sans-source
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python build.py --install   # downloads + verifies upstream, writes UwUSans[wght].woff2,
                                      # copies it to fonts/ (the shipped file)
.venv/bin/python test_shaping.py      # shaping tests (HarfBuzz)
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
