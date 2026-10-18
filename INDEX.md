# The AI SDR Receipts Index

How many claims in AI-written sales emails show where they came from? Nobody has counted. We're going to, in the open.

## What it will measure

For each email: how many sentences make a claim, how many of those show a source, and how many guesses are written as facts. That's the [Receipts score](STANDARD.md#the-score). The index reports the totals, and the totals for each tool where we know which tool wrote the email.

## How to send us an email

1. You received a sales email that you think an AI tool wrote.
2. Remove every name, email address, phone number and company name that could identify a person. Replace them with `[name]`, `[company]` and so on.
3. Open a [new submission](https://github.com/MachGTM/receipts/issues/new?template=submit-email.yml) and paste it in. Say which tool wrote it if the email or its footer tells you; otherwise leave it blank.

Only send emails you received yourself. Don't send emails your employer would consider confidential.

## How each email is scored

1. The sentences are run through the [receipts check](https://machgtm.github.io/receipts/check/), so anyone can repeat the first pass.
2. A person reads each result and corrects it, since a pattern check misses some claims and flags some that aren't. Every correction is written down.
3. A claim counts as sourced only if the email itself shows the source: a link, or a footnote with a link. A source the sender kept to themselves can't be counted from the outside.

## Fair to everyone

- **No people.** Submissions with personal details still in them are edited or removed before anything is published.
- **Tools named only with enough data.** A tool is named in the results only when we have at least 20 emails we can attribute to it. Below that, its emails count in the total only.
- **A right to reply.** Before an edition is published, every named tool gets the method, its numbers and a week to respond. Responses are published next to the numbers.
- **Everything in the open.** The method, the scoring code and the anonymised emails are published with each edition, so anyone can check the count.
- **MachGTM is in it too.** Emails written with MachGTM are scored the same way and shown the same way.

## When

The first edition comes out once we have 100 scored emails. Until then, submissions stay open here.

Questions or objections to the method: open an issue. The method can change before the first edition; after that, changes are listed with each edition.
