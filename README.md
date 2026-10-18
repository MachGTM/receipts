# Receipts: no source, no send

An open standard, a free checker and open data for sales messages written with AI.

AI can write a thousand cold emails an hour. Most of them sound sure of things nobody checked. The fix is simple to say: every claim shows where it came from, guesses are asked instead of stated, and a person approves each message before it goes out.

[![Receipts Standard v1: checked](badge/checked.svg)](STANDARD.md)

## What's here

| | |
|---|---|
| **[The Receipts Standard v1.0](STANDARD.md)** | Seven rules, two levels, a score and a small JSON format for receipts. CC BY 4.0. |
| **[The receipts check](check/)** | Paste an email and see which sentences make claims and which show a source. Runs in your browser; nothing leaves the page. Live at [machgtm.github.io/receipts/check](https://machgtm.github.io/receipts/check/). |
| **[Who's hiring SDRs, October 2026](hiring-index/2026-10/)** | 123 B2B software companies, 9,931 open roles, every SDR role linked to its post. 53% have an open SDR role; 8 have a "GTM engineer" opening. |
| **[The AI SDR Receipts Index](INDEX.md)** | An open count of how many claims in AI-written sales emails show a source. [Send us one](https://github.com/MachGTM/receipts/issues/new?template=submit-email.yml). |

## The seven rules, short version

1. Every claim about the prospect has a receipt: a public link, the exact words, a date.
2. Every claim about the seller has a receipt too.
3. Guesses are asked, never stated.
4. Unknowns stay unknown.
5. Signals are dated, and old ones aren't called recent.
6. A named person approves each message.
7. Receipts come only from fair, public sources.

Read [the full standard](STANDARD.md) for examples, the score and the receipt format.

## Use it

- **Check an email**: [the receipts check](https://machgtm.github.io/receipts/check/), or open `check/index.html` from this repo.
- **Check and fix an email with Claude or Codex**: the `check-receipts` skill in [Lead Finder](https://github.com/MachGTM/lead-finder) finds a source for each claim and rewrites the rest as questions.
- **Use the check in your own tool**: `check/receipts-check.js` has no dependencies and works in the browser and Node.

```js
const { check } = require("./check/receipts-check.js")
check("I saw you raised a Series A. Worth a call?").summary
// "Receipts: 0 of 1 claims (0)"
```

- **Say you follow it**: add the badge and link to the standard.

```markdown
[![Receipts Standard v1: checked](https://raw.githubusercontent.com/MachGTM/receipts/main/badge/checked.svg)](https://github.com/MachGTM/receipts/blob/main/STANDARD.md)
```

Anyone may adopt the standard, including companies that compete with MachGTM.

## Contributing

Suggest a change to the standard, report a sentence the checker gets wrong, or send an AI-written email for the index: [open an issue](https://github.com/MachGTM/receipts/issues/new/choose).

## Licence

The standard, the index method and the data are [CC BY 4.0](LICENSE-CC-BY-4.0.md). The code (`check/`) is [MIT](LICENSE).

Maintained by [MachGTM](https://machgtm.com), an AI SDR that writes every claim with its source and sends only what you approve.
