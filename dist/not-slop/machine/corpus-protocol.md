# CORPUS PROTOCOL — the machine's taste
**not-slop machine · Part 5 of 6**

Taste is compressed experience, not compilable rules. The corpus is the
compressed experience; this protocol is how the machine uses it without cloning
it. Retrieval discipline is mechanical. *What's worth retrieving* is still taste
— that's the human-curated corpus, not this file.

## The quarantine (load-bearing)

The generator must **NEVER see a raw reference**. Only abstracted solution
descriptions cross the boundary: "confident asymmetry; content leads, chrome
recedes" — never "hero with left-aligned serif headline." Experimental backing:
high-abstraction avoidance doubled creative ideas; specific avoidance increased
fixation. In an AI system the quarantine is trivially cheap: two LLM calls with
a hard context boundary.

**The abstraction pass is mandatory and separate.** Every retrieved reference
goes through the abstractor (a distinct call with no build context) before the
builder sees anything. The abstractor's test (Brattengeier): "If I can describe
what I love without describing how it looks, it's an idea worth something."
Anything that can't survive abstraction is surface, not idea — drop it.

## The executable procedure

### Step 1 — Direction first (before ANY retrieval)
Commit to the direction in words (from the brief's One Idea). The direction
statement becomes a mandatory facet of every later retrieval query. References
serve the direction; they never replace it.

### Step 2 — Macro retrieval (once per project)
- Retrieve 50–100 candidates, cull to a mood-board cluster of 15–25.
- Present as 2–3 distinct directions (not 25 variations of one).
- **Anti-board in parallel:** 1–3 things this must NOT look like, named.
- Never index direct-category competitor work as a positive reference.
- {{AMMO: the style library — named styles-as-wholes with exemplars, the
  macro retrieval pool}}

### Step 2b — The bar (YES-corpus retrieval, once per project)
In parallel with the anti-board, pull 3–5 exemplars from `YES_CORPUS.md`
whose genre is closest to the brief's subject (product → Linear / Teenage
Engineering / Vitsoe; editorial → Pudding / NYT; tool → Are.na; brand →
Aesop / Locomotive). These are the bar: what winning looks like, not just
what failing avoids. Each exemplar goes through the same mandatory
abstraction pass (Step 3) — bar-lessons (idea + what it teaches + why it
works for this brief), never raw references. The abstracted bar is written
to the run's `direction/bar.md` and travels to the P8 elevation pass as its
comparative set. The quarantine, multi-source minimum, and temporal
discipline apply to yes-references identically: retrieval at
direction-setting, then the references leave the room.

### Step 3 — Abstraction pass (mandatory, quarantined)
Every macro reference → abstract description via the separate abstractor call.
Raw references are then **dropped from context**. What crosses: the idea, the
layer it teaches, its role label. What never crosses: how it looks.

### Step 4 — Per-decision retrieval (during build)
For each significant visual decision, retrieve **3–7 items**:
- 1 macro anchor (from the culled board, serving the direction),
- 2–3 meso — each from a **different layer** (composition / color / type /
  texture / motion / space / **imagery**) **and** a different source,
- 1–2 micro (a type pairing, an easing curve, a spacing ratio).
- Hard floor 3 (single-source = cloning by definition). Hard ceiling 7
  (search-spiral trap).
- **≥1 reference forced from outside the target medium**, labeled `role: idea`.
- **Imagery is a permanent layer, not an optional one.** Every direction must
  include an art-direction/imagery abstraction: how the real product is shown,
  in what register, mounted how. Standing F1 law: real product photography
  outranks illustration always — the retriever plans for the photograph, not
  the drawing. If no product imagery exists yet, the direction specifies what
  must be shot/generated and in what register, so the builder never defaults
  to drawing the product.
- Never retrieve a whole page as a template. Retrieve at the layer, never the
  artifact.
- {{AMMO: the layer-tagged example corpus — meso/micro retrieval pool with
  layer tags, role labels, provenance}}

### Step 5 — The critic's corpus gate (review time)
The critic checks the finished artifact against the board **and** the
anti-board: does the output resemble any single reference closely enough to be
derivation rather than influence? (Blind similarity judgment is the test, not
the builder's assurance.)

## The 8 anti-cloning techniques (the firewall)

The load-bearing three are marked ★:

1. ★ **Abstraction pass** (above) — surface never crosses the boundary.
2. ★ **Multi-source minimum** — ≥3 sources, ≥1 cross-medium per decision.
3. ★ **Quarantine** — hard context boundary between retrieval and generation.
4. Layer decomposition — composition from A, color from B, type from C; never
   two layers from one source for one decision.
5. Role labeling — every retrieved item labeled `role: idea` (structural
   lesson) or `role: aesthetic` (surface lesson); aesthetic-role items get
   extra abstraction scrutiny.
6. Provenance annotation — origin / brief / constraints recorded per entry, so
   the builder knows *why* the reference works, not just that it does.
7. The anti-board — named things to avoid, checked at review.
8. Temporal discipline — retrieve early (direction-setting, per-decision);
   **never** a late "inspiration pass" before finalizing (maximum conformity,
   zero creative gain).

## Schedule

Retrieve early, never late. Early exposure → higher creativity ratings and more
uncommon features; late exposure → no benefit, all exposure → increased
conformity. The single worst schedule is a late inspiration pass before
finalizing. Retrieval belongs at direction-setting and per-decision — then the
references leave the room.

{{AMMO: retrieval-query templates per layer — how to ask the corpus for
composition vs color vs type vs motion}}
{{AMMO: the abstractor's prompt — the exact instruction that produces
look-free descriptions, validated against leakage tests}}
