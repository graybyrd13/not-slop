# Add a gallery before/after pair

**Good first issue — prove the machine works in public**

## Background

`gallery/` is the repo's proof that the machine produces a real difference:
before/after screenshots from builds that went through the full pipeline
(baseline → passes → human verdict), with captions naming exactly what the
NOS rules forced and what changed. Right now it only has the violin build.
Take a real build of your own through the machine, capture the baseline and
the final, and add the pair.

## Definition of done

- [ ] Two screenshots added to `gallery/`: a baseline and a final, rendered
      at the same viewport (1440px wide), following the existing naming
      convention (e.g. `<run-name>-baseline-1440.png`,
      `<run-name>-final-1440.png`); a 375px mobile capture of the final is
      a bonus.
- [ ] Both images are real renders of a build that actually went through the
      machine — no mockups, no AI-generated imagery, no photoshopped
      after-images.
- [ ] `gallery/README.md` gains a section naming the build, the thesis, and
      — specifically — which NOS entries the before violated and which
      passes forced the change (the violin entry is the model: it names the
      standing law the build created).
- [ ] The caption states what the machine added that a single-shot build
      would not have (the gap the critic/passes closed), in two sentences or
      fewer.
