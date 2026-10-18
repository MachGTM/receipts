# The Receipts Standard, v1.0

**No source, no send.**

A short, open standard for sales messages written with AI. Every claim in the message can be traced to where it was found, guesses are asked instead of stated, and a person approves each message before it goes out.

Version 1.0, published 19 October 2026. Licence: CC BY 4.0. Maintained by [MachGTM](https://machgtm.com).

---

## Why this exists

AI can now write a thousand cold emails an hour. Most of them sound sure of things nobody checked: "I saw you're expanding into Europe", "Teams like yours struggle with pipeline", "We helped a company like yours grow 3x".

Buyers have learnt to spot this, and they delete it. Senders burn their domains. The fix is not better prose. It is knowing which sentences are true, and being able to show it.

This standard is the minimum a sales message should meet, whoever or whatever wrote it.

## Words used here

- **Message**: any sales email, LinkedIn note, call opener or follow-up sent to a prospect.
- **Claim**: a sentence a reader could check as true or false. "You raised a Series B in May" is a claim. "Would a 15-minute call help?" is not.
- **Receipt**: the proof behind one claim: a public link, the exact words or number found there, and a date.
- **Guess**: anything the sender believes but has not seen written down.

## The seven rules

### R1. Every claim about the prospect has a receipt

If the message says something about the buyer's company, people, hiring, money, tools or plans, there is a receipt for it.

| Without a receipt | With a receipt |
|---|---|
| "I saw you're growing fast." | "You have 14 open roles on your careers page, 6 of them in sales." (careers page, seen 19 Oct 2026) |
| "Congrats on the funding!" | "Congrats on the $12M Series A announced on 3 Sept." (press release, 3 Sept 2026) |

### R2. Every claim about the seller has a receipt too

Results, customer names, numbers and rankings about the sender need proof the buyer could see or ask for: a published case study, a customer who agreed to be named, or a document on request.

"We cut onboarding time by 40% for a fintech" needs the case study. "Trusted by 500 companies" needs the list or it goes.

### R3. Guesses are asked, never stated

If you believe it but haven't seen it written down, turn it into a question.

- Stated guess: "Since you're struggling with outbound..."
- Asked guess: "How is outbound going since the new sales lead joined?"

Questions are always allowed. They are how a good seller learns.

### R4. Unknowns stay unknown

Missing information is not filled in. Headcount, revenue, tech stack, budget and pain are never inferred and then written as fact. "We couldn't find this" is a valid result.

### R5. Signals are dated

Anything offered as a reason to reach out now (hiring, funding, a new leader, a launch) carries the date it happened. The sender states the window they treat as recent. The default is 180 days. Older signals are not called "recent".

### R6. A named person approves each message

Before a message is sent, a named person on the sender's team reads the exact text and its receipts and approves it. Approval covers that one message. Approving a campaign, a template or a first email does not approve the AI-written replies that follow.

### R7. Receipts come only from fair sources

Receipts are public pages: the company's own site, job posts, press releases, filings, news, public posts. Nothing behind a login, nothing scraped against a site's terms, and no personal phone numbers or private emails used as proof.

## Two levels

| Level | What it means |
|---|---|
| **Receipts: checked** | R1 to R7 are met. Every receipt is kept on record with the message, and the approver saw them. |
| **Receipts: shown** | Also, the buyer can see the receipts: links in the message, footnotes, or a link to a page that lists them. |

"Shown" is the stronger promise. It lets the buyer check the seller instead of trusting them.

## The receipt format

So tools can pass receipts between each other, a receipt is a small JSON object. Field names match [Lead Finder](https://github.com/MachGTM/lead-finder).

```json
{
  "claim": "You have 6 open sales roles.",
  "about": "prospect",
  "source": "https://example.com/careers",
  "quote": "Account Executive, Sales Development Representative (x3), ...",
  "date": "2026-10-19",
  "seen": "2026-10-19"
}
```

| Field | Required | Meaning |
|---|---|---|
| `claim` | yes | The sentence in the message, as written |
| `about` | yes | `prospect`, `seller` or `world` |
| `source` | yes | A public `http(s)` link |
| `quote` | yes | The exact words or number found at the source |
| `date` | for signals | When it happened or was published, `YYYY-MM-DD` |
| `seen` | yes | When the sender checked the source, `YYYY-MM-DD` |

A message's receipts are a list of these, kept with the message and the name of the person who approved it.

## The score

To compare messages, tools or campaigns:

**Receipts score = claims with a receipt ÷ all claims × 100**

Questions are not claims, so asking more and asserting less never lowers the score. A message with no claims at all scores 100: it asserts nothing it can't back.

Report the score with the count, for example "Receipts: 7 of 9 claims (78)", so nobody hides a thin message behind a percentage.

## How to adopt it

1. Check your next ten messages against R1 to R7. The free [receipts check](https://machgtm.github.io/receipts/check/) flags sentences that look like claims without a source.
2. Fix the template or the prompt, not just the message. Most unsourced claims come from a line that tells the writer to "personalise" without saying where the facts come from.
3. Keep receipts with every sent message.
4. Say so publicly if you like. Use the badge and link to this page:

```markdown
[![Receipts Standard v1: checked](https://raw.githubusercontent.com/MachGTM/receipts/main/badge/checked.svg)](https://github.com/MachGTM/receipts/blob/main/STANDARD.md)
```

Anyone may adopt this standard, including companies that compete with MachGTM. There's no fee and no certification. Claiming it and not meeting it is on you.

## Questions

**Does this make emails longer?** No. Receipts sit with the message for the approver. Only "shown" puts them in front of the buyer, and a single link to a receipts page does that.

**Is AI allowed to write the message?** Yes. The standard is about what the message claims and who approved it, not who typed it.

**What about "I loved your recent post"?** That is a claim about the prospect. It needs the post's link. If you can't name the post, don't say you loved it.

**Is industry data a claim?** Yes. "73% of CFOs say..." needs the survey, its publisher and its year (`about: world`).

**Who decides if a source is good enough?** The approver, under R6. The standard asks that a source exists, is public and says what you say it says.

## Changes

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-10-19 | First version |

Suggest changes by opening an issue at [github.com/MachGTM/receipts](https://github.com/MachGTM/receipts/issues).
