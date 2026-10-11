# Propose a technique

**Good first issue — add a concrete move to the library**

## Background

`techniques/TECHNIQUES.md` is the machine's move library: thesis-agnostic
HOWs, never pre-made components or style presets. A recipe is only accepted
if it's executable from the entry alone AND says exactly where it breaks —
a technique with no failure mode is a vibe. Pick a move you can name with
real values and ranges, write the recipe, and state the BREAKS WHEN. See the
evidence bar in `CONTRIBUTING.md` and the `new-technique.yml` issue template.

## Definition of done

- [ ] The entry is appended to `techniques/TECHNIQUES.md` in the exact
      `## T-<n> — <Name the move, verb-first>` format, with all four blocks:
      `**THE MOVE:**`, `**BREAKS WHEN:**`, `**VALIDATED BY:**`,
      `**THESIS-TEST:**`.
- [ ] THE MOVE is concrete enough to execute from the entry alone: real
      values, ranges, steps ("luminance-only noise at 0.5 opacity on a 200px
      tile, full-viewport overlay" — not "add grain").
- [ ] BREAKS WHEN is mandatory and specific: the conditions under which this
      move becomes slop.
- [ ] VALIDATED BY names a source: a build where it worked (with what the
      critic verified), or the research behind it.
- [ ] It passes the thesis test: you describe two *different* theses the
      same recipe could serve. If it only works for one look, it's a
      component — rejected.
- [ ] The PR body includes the two theses from your thesis test.
