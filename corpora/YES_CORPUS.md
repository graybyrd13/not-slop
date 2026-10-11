# YES_CORPUS — the machine's bar
**notslop · what excellent looks like**

The machine has a thousand ways to fail (NOS_CORPUS). It also needs to know
what winning looks like. This corpus is the bar: genuinely exemplary work the
artifact is measured against, not just the floor it must clear. You cannot
exceed a standard you never look at.

Governing rule: every entry is a *nameable* excellence — a specific site, a
specific claim about what makes it excellent, framed as an abstractable lesson.
"Generally good design" is not an entry. If the excellence can't be stated as
an idea (not a look), it doesn't belong here — same Brattengeier test as the
nos side.

## Quarantine (identical to the nos side)

The generator NEVER sees a raw yes-reference. Per-run retrieval pulls 3–5
genre-relevant exemplars; the abstractor converts each to a *bar-lesson*
(idea + what it teaches + why it works for this brief). Only bar-lessons
cross to the builder. The P8 elevation agent receives exemplar names, their
excellence claims, and the abstracted bar-lessons — enough to judge the gap
comparatively, never enough to clone from.

Raw yes-references are never browsed late in the run (temporal discipline —
same as corpus-protocol.md: retrieval belongs at direction-setting, then the
references leave the room).

## Seed collection

Each entry: site, genre, the one excellence claim. Read the claim as the
lesson to abstract, not the surface to copy.

1. **Linear (linear.app)** — SaaS product. Monochrome restraint with one
   rationed accent; the product UI is the only imagery; speed and information
   density treated as aesthetic decisions, not engineering side-effects.
2. **Teenage Engineering (teenageengineering.com)** — brand commerce. Playful
   engineering precision: deadpan technical copy, obsessive detail density,
   every product page a designed object that rewards a second look.
3. **Vitsoe (vitsoe.com)** — minimal commerce. Radical restraint as confidence:
   product + whitespace, nothing to remove; "less but better" without nostalgia
   or lifestyle theater.
4. **Aesop (aesop.com)** — literary commerce. A consistent literary voice across
   every surface; art direction as a system that holds across hundreds of
   pages; restraint that never reads as empty.
5. **The Pudding (pudding.cool)** — data editorial. Form follows the argument:
   every visual and interactive decision serves the piece's thesis;
   interactivity that earns its place or is cut.
6. **Are.na (are.na)** — community tool. Anti-design confidence: the interface
   recedes so completely that the users' content becomes the aesthetic; taste
   expressed through what is refused.
7. **Locomotive (locomotive.ca)** — agency. Motion as narrative, not decoration:
   scroll choreography with intent; every transition carries meaning about the
   work, never motion for its own sake.
8. **Stripe Press (stripe.press)** — publishing/commerce. The book as fetish
   object: typographic confidence, physical craft translated to the page;
   commerce that reads as curation.
9. **NYT interactive features ("Snow Fall" lineage, nytimes.com)** — editorial
   interactive. Scrollytelling with restraint: media in service of narrative,
   never the reverse; the story sets the pace, the page follows.

## Per-run retrieval ("the bar")

During the direction phase, after the winning direction is chosen, pull 3–5
exemplars from this corpus whose genre is closest to the brief's subject
(product page → Linear / Teenage Engineering / Vitsoe; editorial → Pudding /
NYT; tool → Are.na; brand → Aesop / Locomotive). Abstract each through the
quarantine into bar-lessons; write them to the run's `direction/bar.md`. The
P8 elevation agent uses the bar as its comparative set.

Never index direct-category competitors as positive references (same rule as
the nos side — the bar is cross-category excellence, not the rival's page).

## Evolution

This corpus grows through the verdict-encoding loop (verdict-protocol.md):
whenever an F1 verdict names something the build did excellently — or names
an external reference as the standard — a distilled entry lands here. Entries
are never removed silently; superseded entries keep their history like
everything else in this machine.
