# Find an AI tell

**Good first issue — propose a NO**

## Background

`corpora/NOS_CORPUS.md` is the machine's forbidding-grade rulebook: patterns
that mark output as AI-generated, mechanical enough for a weak eye to apply.
It grows one proposal at a time. Your job: go look at real AI-built sites,
find a tell the corpus doesn't already name, and bring it back with data —
"9/10 pro sites do X, 1/10 AI builds do", never vibes. See the evidence bar in
`CONTRIBUTING.md` and the `new-no.yml` issue template.

## Definition of done

- [ ] The entry is appended to `corpora/NOS_CORPUS.md` in the correct section,
      in the exact format: `- **N<n>** [T<tier>] <pattern name>: <mechanical
      check> ⇒ FAIL (<exceptions, if any>).` followed by `Evidence:`.
- [ ] Evidence cites at least 3 real examples with counts (e.g. "7 of the 10
      AI-built dashboards I checked…").
- [ ] The tier is honest: TIER-1 (count/ruler, no taste) only if the check is
      fully mechanical; TIER-2 if it needs one named judgment call; TIER-3 if
      it can't be mechanized — never a TIER-3 dressed as TIER-1.
- [ ] You searched the existing corpus first; the pattern doesn't restate an
      existing NO.
- [ ] The PR body states the claim in one sentence plus the evidence
      (examples, counts, links).
