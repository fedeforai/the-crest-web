# i18n notes

Source of truth for marketing copy: `docs/superpowers/specs/2026-08-08-tone-of-voice-copy.md`

Locale pages:
- IT: `/` (root)
- EN: `/en/`
- FR: `/fr/`

Shared JS (`assets/quiz.js`, `assets/trail.js`) picks strings from `document.documentElement.lang`.

Generators (re-run only if regenerating carefully):
- `scripts/apply_i18n.py`
- `scripts/i18n_pages_extra.py`

Legal pages stay Italian. Founder bios stay Italian in EN/FR with `<!-- TODO: tradurre bio founder -->`.
