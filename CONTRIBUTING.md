# Contributing to notslop

The machine gets better the way taste gets better: from contact with reality.
Every corpus in this repo grows through proposals from people who looked at
real work and named something true about it. That's the contribution surface.

## What you can propose

Three kinds of entries. All three live or die on evidence.

### 1. A NO — an AI tell with data

A forbidding-grade rule: a pattern that marks output as AI-generated,
mechanical enough for a weak eye to apply. "I don't like it" is not a NO.
`N out of M` is.

**The evidence bar:**
- Name the pattern precisely — what it looks like, where it appears.
- Show it firing on real examples: at least 3, ideally with a count
  ("7 of the 10 AI-built dashboards I checked…").
- Write the check so someone else can run it without your taste: counts,
  measurements, named tokens. If it needs a judgment call, say so honestly
  (TIER-2); if it can't be mechanized, say that too (TIER-3) — never dress
  a TIER-3 up as TIER-1.
- No vibes. "Feels generic" is a vibe. "9/10 pro sites do X, 1/10 AI builds
  do" is evidence.

**Entry format** (appended to `corpora/NOS_CORPUS.md` in the right section):

```
- **N<n>** [T<tier>] <pattern name>: <mechanical check> ⇒ FAIL (<exceptions, if any>).
  Evidence: <where you saw it — n/m counts, sources>.
```

### 2. A YES — an exemplary site with an abstractable claim

A site that shows what winning looks like. Not "generally good design" — a
*specific, nameable excellence* framed as an idea, not a look. The test: if
you can state what makes it excellent without describing how it looks, it's
an entry. If the excellence evaporates without the screenshots, it's surface.

**The evidence bar:**
- Name the site and its genre.
- State the ONE excellence claim in a sentence: what it does, and why it
  works — as an abstractable lesson, not a style description.
- Say what the machine should steal: the idea a builder could apply to a
  completely different brief.

**Entry format** (appended to `corpora/YES_CORPUS.md`, seed collection):

```
<n>. **<Site> (<url>)** — <genre>. <Excellence claim: the idea, abstractable.>
   <What it teaches / why it works for a builder.>
```

### 3. A TECHNIQUE — a concrete move with limits

A thesis-agnostic HOW: a recipe executable from the entry alone. Never a
pre-made component, template, or style — those are how outputs converge into
slop. Every technique must say where it breaks.

**The evidence bar:**
- The recipe must be concrete enough to execute: values, ranges, steps.
  "Add grain" is not a recipe. "luminance-only noise at 0.5 opacity on a
  200px tile, full-viewport overlay" is.
- **BREAKS WHEN** is mandatory and specific: the conditions under which this
  move becomes slop. A technique with no failure mode is a vibe.
- Name the validation source: a build where it worked (with what the critic
  verified), or the research behind it.
- Pass the thesis test: describe two *different* theses the same recipe
  could serve. If it only works for one look, it's a component — rejected.

**Entry format** (appended to `techniques/TECHNIQUES.md`):

```
## T-<n> — <Name the move, verb-first>

**THE MOVE:** <concrete recipe — values, ranges, steps>

**BREAKS WHEN:** <specific failure conditions>

**VALIDATED BY:** <build / research source + what was verified>

**THESIS-TEST:** <two different theses this serves>
```

## The PR process

1. Fork the repo. One proposal per PR — don't bundle a NO, a YES, and a
   technique into one.
2. Put the entry in the right file, in the exact format above, appended in
   sequence (next N-number / T-number).
3. In the PR body: the claim in one sentence, the evidence (examples, counts,
   links), and — for techniques — the two theses from your thesis test.
4. Use the issue templates first if you want feedback before writing the PR:
   `.github/ISSUE_TEMPLATE/` has `new-no.yml`, `new-yes.yml`,
   `new-technique.yml`.

## Review

The maintainer (@graybyrd13) is the final judge on every proposal. Expect
pushback on the evidence bar — most proposals die there, and that's the
point. A corpus that accepts vibes becomes vibes. Accepted entries land in
the corpora with their evidence attached; rejected ones get a reason, not
silence.

## What not to propose

- Whole-page templates, component libraries, or style presets. The machine
  assembles from constraints and moves, never from prebuilt parts.
- Rules that restate an existing entry. Search the corpora first.
- Entries without evidence. See above; this is the whole game.
