/*
 * not-slop — reference orchestration (craft-build)
 * =================================================
 * This is the actual multi-agent orchestration script that runs the not-slop
 * machine. It is written for the Hatch workflow runtime and is NOT
 * standalone-runnable: it depends on the runtime globals `agent()`,
 * `phase()`, `parallel()`, `pipeline()` and `log()`, which only exist inside
 * a workflow execution. It is included here so contributors can port the
 * machine to other harnesses (LangGraph, Temporal, plain scripts, ...).
 *
 * What it does, in order:
 *   brief -> direction tournament (3 angles + cold judge) -> site architect
 *   -> quarantined build -> render (3 viewports) -> critic (kill list +
 *   bounded repair) -> passes P1-P7 -> P8 elevation (+ copy authorship)
 *   -> F1 human verdict (blocking) -> learn (verdict encoding, parent-gated)
 *
 * Porting notes:
 * - Every `agent(prompt, {key, schema, timeoutMs})` call is one fresh-context
 *   child agent. `key` values are stable so a retry can reuse completed
 *   results. The JSON schemas are minimum contracts for the agent's return.
 * - The machine's standing files (machine/*.md, corpora/*.md) are the
 *   agents' read-only inputs; paths below assume a not-slop working tree.
 * - F1 is load-bearing and human: the run blocks until a person judges the
 *   rendered artifact. Never automate the verdict.
 */
export const meta = {
  name: "craft-build",
  description: "The craft machine, repeatable: brief → direction → build → render → critic → seven passes → human (F1) verdict. Encodes the v4/v5 orchestration as deterministic code. Launch with args {subject, ...}; it pauses blocked for the F1 verdict at the end.",
  phases: [
    { name: "brief", title: "Phase 0 — Brief", detail: "Draft, test, and freeze the constraint document" },
    { name: "direction", title: "Phase 1 — Direction", detail: "Tournament (3 angles) + judge + materiality track" },
    { name: "architect", title: "Phase 1b — Site architect", detail: "Sitemap, nav system, shared tokens, cross-page linking" },
    { name: "build", title: "Phase 2 — Build", detail: "Builder works from brief + abstractions only" },
    { name: "render", title: "Phase 3 — Render", detail: "Deterministic screenshots at 1440 / 768 / 375" },
    { name: "critic", title: "Phase 4 — Critic", detail: "Kill list + bounded verifier-repair loop" },
    { name: "passes", title: "Phase 5 — Seven passes", detail: "P1–P7 in strict order, invalidation enforced" },
    { name: "p8", title: "Phase 5b — Elevation", detail: "One comparative round against the bar (no loops)" },
    { name: "f1", title: "Phase 6 — Human verdict", detail: "Pause for the F1 judgment (load-bearing, never automated)" },
    { name: "learn", title: "Phase 7 — Verdict encoding", detail: "Encode the F1 verdict into the machine's files (parent-gated)" }
  ]
};

// ---------------------------------------------------------------------------
// Inputs & paths
// ---------------------------------------------------------------------------
const inputs = args ?? {};
const runName = inputs.run_name || "craft-run";
const today = inputs.today || "use your best knowledge of today's date";
const maxCriticRounds = (inputs.budgets && inputs.budgets.max_critic_rounds) || 3;
const maxSequences = (inputs.budgets && inputs.budgets.max_sequences) || 3; // 1 initial + 2 re-sequences

const RUN = "./runs/" + runName;
const F = {
  brief: RUN + "/brief/brief.md",
  evidence: RUN + "/brief/evidence/",
  abstractions: RUN + "/direction/abstractions.md",
  dirAbstractions: function (l) { return RUN + "/direction/abstractions-" + l + ".md"; },
  bar: RUN + "/direction/bar.md",
  judgment: RUN + "/direction/judgment.md",
  materiality: RUN + "/direction/materiality.md",
  artifact: RUN + "/build/artifact.html",
  ledger: RUN + "/build/ledger.md",
  learn: RUN + "/learn/verdict-lessons.md",
  architecture: RUN + "/architecture/site.md",
  pagesDir: RUN + "/build/pages/",
  rendersDir: RUN + "/renders/",
  critiqueDir: RUN + "/critique/",
  dispositionsDir: RUN + "/dispositions/",
  passesDir: RUN + "/passes/",
  critique: function (n) { return RUN + "/critique/kill-" + n + ".md"; }
};
// The machine's standing files (read-only for children).
const MF = {
  briefTemplate: "machine/brief-template.md",
  corpusProtocol: "machine/corpus-protocol.md",
  criticCharter: "machine/critic-charter.md",
  ledgerFormat: "machine/ledger-format.md",
  passes: "machine/passes.md",
  renderLoop: "machine/render-loop.md",
  builderCharter: "machine/builder-charter.md",
  nosCorpus: "corpora/NOS_CORPUS.md",
  yesCorpus: "corpora/YES_CORPUS.md",
  verdictProtocol: "machine/verdict-protocol.md"
};

function isBlocked(x) { return !!x && x.__hatchWorkflowControl === "blocked"; }
function blocked(reason, message) {
  return { __hatchWorkflowControl: "blocked", result: { blocked_reason: reason, message: message } };
}

// ---------------------------------------------------------------------------
// Schemas (minimum contracts — declare every field the workflow reads)
// ---------------------------------------------------------------------------
const BRIEF_SCHEMA = { type: "object", properties: {
  brief_path: { type: "string" }, evidence_dir: { type: "string" }, one_idea: { type: "string" },
  page_scope: { type: "string" },
  tests_passed: { type: "object", properties: {
    audience_flip: { type: "boolean" }, not_list_sweep: { type: "boolean" }, adjective_negation: { type: "boolean" } },
    required: ["audience_flip", "not_list_sweep", "adjective_negation"] },
  notes: { type: "string" } },
  required: ["brief_path", "one_idea", "page_scope", "tests_passed"] };

const DIRECTION_SCHEMA = { type: "object", properties: {
  abstractions_path: { type: "string" }, direction_paragraph: { type: "string" },
  imagery_required: { type: "array", items: { type: "string" } }, imagery_register: { type: "string" },
  lesson_count: { type: "number" } },
  required: ["abstractions_path", "direction_paragraph", "imagery_required", "imagery_register"] };

const MATERIALITY_SCHEMA = { type: "object", properties: {
  materiality_path: { type: "string" }, direction_paragraph: { type: "string" },
  lesson_count: { type: "number" }, handling_test_summary: { type: "string" } },
  required: ["materiality_path", "direction_paragraph", "handling_test_summary"] };

const BUILD_SCHEMA = { type: "object", properties: {
  artifact_path: { type: "string" }, ledger_path: { type: "string" }, build_ready: { type: "boolean" },
  blocked_needs: { type: "array", items: { type: "string" } },
  pages: { type: "array", items: { type: "object", properties: {
    slug: { type: "string" }, path: { type: "string" } },
    required: ["slug", "path"] } },
  key_decisions: { type: "array", items: { type: "string" } },
  render_verified: { type: "string" }, notes: { type: "string" } },
  required: ["artifact_path", "ledger_path", "build_ready", "blocked_needs", "pages"] };

const RENDER_SCHEMA = { type: "object", properties: {
  desktop: { type: "string" }, tablet: { type: "string" }, mobile: { type: "string" },
  extra_pages: { type: "array", items: { type: "object", properties: {
    slug: { type: "string" }, desktop: { type: "string" }, mobile: { type: "string" } },
    required: ["slug", "desktop", "mobile"] } },
  ok: { type: "boolean" }, note: { type: "string" } },
  required: ["desktop", "tablet", "mobile", "ok"] };

const CRITIC_SCHEMA = { type: "object", properties: {
  p0_count: { type: "number" }, p1_count: { type: "number" }, p2_count: { type: "number" },
  critique_path: { type: "string" }, p1_all_dispositioned: { type: "boolean" }, summary: { type: "string" } },
  required: ["p0_count", "p1_count", "p2_count", "critique_path", "p1_all_dispositioned", "summary"] };

const REPAIR_SCHEMA = { type: "object", properties: {
  artifact_path: { type: "string" }, dispositions_written: { type: "number" },
  p0_dispositioned: { type: "number" }, p1_dispositioned: { type: "number" }, notes: { type: "string" } },
  required: ["artifact_path", "dispositions_written"] };

const PASS_SCHEMA = { type: "object", properties: {
  defects_found: { type: "number" }, defects_fixed: { type: "number" }, p0p1_surfaced: { type: "number" },
  exit_clean: { type: "boolean" }, changes: { type: "string" }, pixels_moved: { type: "boolean" },
  report_path: { type: "string" }, notes: { type: "string" } },
  required: ["defects_found", "exit_clean", "changes", "report_path"] };

const P6_SCHEMA = { type: "object", properties: {
  findings: { type: "array", items: { type: "object", properties: {
    severity: { type: "string" }, owning_pass: { type: "string" }, description: { type: "string" } },
    required: ["severity", "owning_pass", "description"] } },
  exit_clean: { type: "boolean" }, report_path: { type: "string" }, notes: { type: "string" } },
  required: ["findings", "report_path"] };

const P7_SCHEMA = { type: "object", properties: {
  disposition: { type: "string" }, work_order: { type: "array", items: { type: "string" } }, notes: { type: "string" } },
  required: ["disposition"] };

const REWORK_SCHEMA = { type: "object", properties: {
  artifact_path: { type: "string" }, notes: { type: "string" } },
  required: ["artifact_path"] };

const JUDGE_SCHEMA = { type: "object", properties: {
  winner: { type: "string" }, judgment_path: { type: "string" },
  reasoning: { type: "string" }, bar_path: { type: "string" } },
  required: ["winner", "judgment_path", "reasoning", "bar_path"] };

const P8_SCHEMA = { type: "object", properties: {
  gap_found: { type: "boolean" }, gap_description: { type: "string" },
  report_path: { type: "string" }, notes: { type: "string" } },
  required: ["gap_found", "report_path"] };

const ELEVATION_REWORK_SCHEMA = { type: "object", properties: {
  artifact_path: { type: "string" }, changes: { type: "string" }, notes: { type: "string" } },
  required: ["artifact_path", "changes"] };

const LEARN_SCHEMA = { type: "object", properties: {
  lessons_path: { type: "string" }, summary: { type: "string" },
  proposals: { type: "array", items: { type: "string" } } },
  required: ["lessons_path", "summary", "proposals"] };

const ARCHITECT_SCHEMA = { type: "object", properties: {
  architecture_path: { type: "string" },
  pages: { type: "array", items: { type: "object", properties: {
    slug: { type: "string" }, path: { type: "string" }, purpose: { type: "string" } },
    required: ["slug", "path", "purpose"] } },
  tokens_summary: { type: "string" } },
  required: ["architecture_path", "pages", "tokens_summary"] };

const AUTHOR_SCHEMA = { type: "object", properties: {
  artifact_path: { type: "string" }, changes_summary: { type: "string" }, notes: { type: "string" } },
  required: ["artifact_path", "changes_summary"] };

// ---------------------------------------------------------------------------
// Prompt builders (every child prompt is self-contained: paths, charter,
// deliverable — never "see conversation history")
// ---------------------------------------------------------------------------
function briefPrompt(feedback, attempt) {
  const subject = inputs.subject;
  const audienceLine = inputs.audience ? "Audience hint: " + inputs.audience : "Audience: derive it from research — name a non-obvious truth about the reader.";
  const priorLine = inputs.prior_failures
    ? "Prior builds failed and why (one sentence — you must NOT see their content): " + inputs.prior_failures
    : "No prior builds exist for this subject.";
  const fbLine = feedback ? "REWRITE FEEDBACK (address this; the unreachability tests do not bend): " + feedback : "";
  return "You are the BRIEF-WRITER for a craft-build run. Fresh context. You will be terminated after delivering the brief — you cannot soften your own constraints later.\n\n" +
    "ASSIGNMENT\nSubject: " + subject + "\n" + audienceLine + "\n" + priorLine + "\n" + fbLine + "\n\n" +
    "Read FIRST: " + MF.briefTemplate + "\n\n" +
    "YOUR JOB\n" +
    "1. Research the category (web search allowed): inventory the 3 generic defaults BY NAME (these feed the Not-List Sweep); gather audience evidence. Do not invent insights from priors.\n" +
    "2. Draft the 5-field brief, 100–150 words total: F1 PROBLEM (the job, one sentence), F2 AUDIENCE (one sentence with a non-obvious truth; if the default audience leaves the solution unchanged, F2 failed), F3 THE ONE IDEA (the positive aesthetic thesis, <=5 words, no quality adjectives — every build is FOR something), F4 NOT-LIST (minimum 3 NAMED prohibitions, never vague vices), F5 FEEL→DO (emotional state on arrival + the single action it must cause).\n" +
    "2b. Declare S0 SCOPE (outside the word count): page count and one-line purpose per page. Default: single page. Each additional page must justify itself — a purpose the primary page cannot serve. This sitemap is binding on the site-architect: no more pages, no fewer.\n" +
    "3. Run the 3 unreachability tests on your draft and report each HONESTLY: (1) Audience Flip, (2) Not-List Sweep, (3) Adjective Negation. If any test fails, rewrite the brief — never weaken the test.\n" +
    "4. Write " + F.brief + " and put research artifacts in " + F.evidence + "\n\n" +
    "Date to use in dated material: " + today + ".\n\n" +
    "RETURN your result as a JSON object with exactly these fields: brief_path, evidence_dir, one_idea, page_scope (one line per page: slug + purpose; 'single page' if one), tests_passed {audience_flip, not_list_sweep, adjective_negation}, notes.";
}

// Direction tournament: three retrievers, same brief, distinct creative
// provocations so they genuinely diverge. The judge picks the winner.
const DIRECTION_ANGLES = [
  { letter: "a", name: "Materiality",
    lens: "Bias HARD toward materiality and handling: how does this thesis feel IN THE HAND? What has the subject accumulated through handling — stock, tooth, impression, stamps, functional handwriting, mounting, sealing, administrative marks? The direction must be defensible as a handled object first, a composition second. Push the material-life reading as far as the brief's One Idea allows." },
  { letter: "b", name: "Composition",
    lens: "Bias HARD toward composition and frame: the artifact as a bounded, finite OBJECT. How does the page compose — its geometry, its edges, its entry and exit, the deliberate frame? Standing law: the frame is underrated, endless scrolling makes people skip. Push the bounded-object reading as far as the brief's One Idea allows; materiality serves the composition, not the reverse." },
  { letter: "c", name: "Contrarian",
    lens: "Be the CONTRARIAN: argue against the obvious reading of the brief. Find the counter-intuitive direction that still serves the frozen One Idea — the reading a competent designer would dismiss too fast. You must still honor every NOT-list item and unreachability test; the contrarianism is in the positive direction, not in breaking constraints. If the obvious direction is 'archive', yours might be 'relic'; if the obvious is 'quiet', find the loudness inside the quiet. Surprise the judge." }
];

function directionPrompt(angle) {
  const outPath = F.dirAbstractions(angle.letter);
  return "You are the DIRECTION RETRIEVER (" + angle.name + " angle) for a craft-build run. Fresh context. Terminated after delivery.\n\n" +
    "Read FIRST:\n- " + F.brief + " — the frozen brief. THE ONE IDEA governs everything.\n- " + MF.corpusProtocol + " — the retrieval procedure (quarantine, layers, abstraction).\n\n" +
    "YOUR CREATIVE PROVOCATION (this is what makes you diverge from the other two retrievers):\n" + angle.lens + "\n\n" +
    "YOUR JOB\n" +
    "1. Commit the direction in words FIRST (one paragraph: what the One Idea means visually, through your lens), before any retrieval. References serve the direction; never replace it.\n" +
    "2. Macro retrieval per the protocol: 5–7 reference inputs across layers (composition / color / type / texture / motion / space / imagery), at least 1 forced cross-medium, plus an anti-board of 1–3 named things this must NOT look like. Never index direct-category competitors as positive references.\n" +
    "3. IMAGERY IS A PERMANENT LAYER. The direction must specify the product-imagery register: how the real product is shown, in what register (e.g. forensic documentation, studio, in-use), mounted how. Standing law: real product photography outranks illustration ALWAYS. If the imagery does not exist yet, specify EXACTLY what must be shot or generated (subject, register, framing) — the builder must never default to drawing the product.\n" +
    "4. Run the MANDATORY ABSTRACTION PASS: emit ONLY abstracted layer-lessons (idea + layer + role label). No URLs, no site names, no raw references — nothing the builder could clone. Raw references are dropped from context after abstraction.\n" +
    "5. Write " + outPath + ": direction paragraph + anti-board + abstracted layer-lessons.\n\n" +
    "FORBIDDEN: the nos corpus (" + MF.nosCorpus + "), the critic charter (" + MF.criticCharter + "). You do not build.\n\n" +
    "Date: " + today + ".\n\n" +
    "RETURN your result as a JSON object with exactly these fields: abstractions_path, direction_paragraph, imagery_required (array of descriptions, empty if none), imagery_register, lesson_count.";
}

function judgePrompt(paragraphs) {
  const listing = DIRECTION_ANGLES.map(function (a, i) {
    return "--- DIRECTION " + a.letter.toUpperCase() + " (" + a.name + ") ---\n" + paragraphs[i];
  }).join("\n\n");
  const paths = DIRECTION_ANGLES.map(function (a) { return a.letter + ": " + F.dirAbstractions(a.letter); }).join("\n");
  return "You are the DIRECTION JUDGE for a craft-build run. Cold context: you have seen nothing but the brief and the three candidate directions below. You never see the nos corpus, the critic charter, or any build.\n\n" +
    "Read FIRST:\n- " + F.brief + " — the frozen brief. THE ONE IDEA is the sole criterion.\n- " + MF.yesCorpus + " — the bar corpus (for step 4 only; its quarantine rules bind you).\n\n" +
    "THE THREE CANDIDATES (direction paragraphs):\n" + listing + "\n\n" +
    "CANDIDATE FILES (full abstractions live here):\n" + paths + "\n\n" +
    "YOUR JOB\n" +
    "1. Judge the three directions SOLELY on which best serves the brief's frozen One Idea — which is the most committed, the most specific, the least generic, the one with the most at stake. Do not average them. Do not merge them. Pick ONE winner.\n" +
    "2. Write your verdict to " + F.judgment + ": the winner (A/B/C), and your reasoning in 3–6 sentences — what the winner commits to that the others don't, and what each loser lacked. No hedging.\n" +
    "3. Copy the winning candidate's FULL abstractions file, byte-for-byte, to " + F.abstractions + " (read it, write it unchanged — do not edit, summarize, or merge).\n" +
    "4. THE BAR: pull 3–5 exemplars from " + MF.yesCorpus + " whose genre is closest to the brief's subject. Abstract each through the quarantine (bar-lesson: idea + what it teaches + why it works for THIS brief — never raw references, never site names in the lessons). Write them to " + F.bar + ".\n\n" +
    "FORBIDDEN: the nos corpus, the critic charter. You do not build.\n\n" +
    "RETURN your result as a JSON object with exactly these fields: winner (one of: a, b, c), judgment_path, reasoning (your verdict, condensed), bar_path.";
}

function materialityPrompt() {
  return "You are the MATERIALITY RETRIEVER for a craft-build run. Fresh context. Terminated after delivery. This phase is permanent: every build gets a materiality track.\n\n" +
    "Read FIRST:\n- " + F.brief + " — the frozen brief.\n- " + MF.corpusProtocol + " — the retrieval procedure.\n\n" +
    "YOUR JOB: supply the MATERIAL LIFE of this brief's world — what the artifact's subject has ACCUMULATED through handling. A page about a handled thing must read as handled, not born-digital.\n" +
    "1. Commit a direction paragraph FIRST: what 'handled, not digital' means for THIS thesis.\n" +
    "2. Retrieve 5–7 references on material life relevant to the thesis (stock/tooth, impression/stamp mechanics, functional handwriting, mounting/attachment, sealing/redaction, accumulated administrative marks). At least 1 cross-medium.\n" +
    "3. MANDATORY ABSTRACTION PASS: abstracted layer-lessons only. No URLs, no site names, nothing clonable.\n" +
    "4. Include an explicit HANDLING-vs-DECORATION TEST with checkable corollaries, runnable by both builder and critic. Standing constraints (non-negotiable): texture uses existing palette tokens only — no new hues; the hand appears only as function (initials/dates/check-marks/codes — never sentences, never personality); damage cliches (coffee rings, burns, tears, stains, distressed edges) are an automatic fail; EVERY material decision must name the past EVENT that produced it, or die.\n" +
    "5. Write " + F.materiality + ": direction paragraph + abstracted layer-lessons + anti-board (what this must NOT look like) + the Handling-vs-Decoration Test.\n\n" +
    "FORBIDDEN: the nos corpus, the critic charter. You do not build.\n\n" +
    "Date: " + today + ".\n\n" +
    "RETURN your result as a JSON object with exactly these fields: materiality_path, direction_paragraph, lesson_count, handling_test_summary.";
}

function architectPrompt() {
  return "You are the SITE-ARCHITECT for a craft-build run. Fresh context. You design the site's structure; the builder builds it.\n\n" +
    "Read FIRST:\n- " + F.brief + " — the frozen brief (its S0 SCOPE declares the page count; it is binding: build exactly these pages, no more, no fewer).\n- " + F.abstractions + " — the WINNING direction (quarantined layer-lessons).\n- " + F.materiality + " — the materiality track.\n\n" +
    "YOUR JOB — produce the site's architecture as ONE coherent design:\n" +
    "1. SITEMAP: every page with its slug, file path under " + F.pagesDir + ", and its ONE purpose (one sentence — what this page alone must do for the brief's FEEL→DO). The first page is the primary (also delivered at " + F.artifact + ").\n" +
    "2. NAVIGATION SYSTEM: the nav design — links, order, labels, active-state treatment — identical across every page. No page may be unreachable: every page is linked from the nav or from another page's body (no orphans).\n" +
    "3. SHARED DESIGN-LANGUAGE TOKENS: the tokens every page honors so the site coheres — typeface(s), type scale, palette tokens, spacing rhythm, border/radius treatment, motion tokens. Write them as a token table the builder copies verbatim. A page that invents its own tokens is a defect.\n" +
    "4. CROSS-PAGE LINKING STRATEGY: how pages send readers to each other in service of the brief's DO (not generic 'related links' — each cross-link must earn its place).\n" +
    "5. Write it all to " + F.architecture + ".\n\n" +
    "FORBIDDEN: the nos corpus, the critic charter. You do not build.\n\n" +
    "Date: " + today + ".\n\n" +
    "RETURN your result as a JSON object with exactly these fields: architecture_path, pages (array of {slug, path, purpose}), tokens_summary (one paragraph: the token decisions a later pass can check mechanically).";
}

function buildPrompt() {
  const have = inputs.imagery_paths || [];
  const imageryLine = have.length > 0
    ? "Product imagery supplied at: " + have.join(", ") + " — use these, mounted per the direction's imagery register."
    : "No product imagery was supplied for this run (the direction required none).";
  return "You are the BUILDER for a craft-build run. Fresh context. You build; a separate critic judges.\n\n" +
    "Read FIRST:\n- " + MF.builderCharter + " — your standing orders (allowlisted inputs, forbidden knowledge, ledger duty, the three standing F1 directives: real product beats illustration, commit to the details, the bounded frame).\n" +
    "- " + F.brief + " — the FROZEN brief. Frozen means frozen: no edits, no softening, no reinterpretation that moves a constraint.\n" +
    "- " + F.architecture + " — the SITE ARCHITECTURE (sitemap, nav system, shared tokens, cross-page linking). Build EXACTLY these pages. Shared tokens are copied verbatim on every page — a page inventing its own tokens is a defect.\n" +
    "- " + F.abstractions + " — quarantined layer-lessons. Your ONLY visual input besides materiality. Never seek raw references.\n" +
    "- " + F.materiality + " — the materiality track. The Handling-vs-Decoration Test is binding: every material decision names its past event or dies.\n" +
    "- " + MF.ledgerFormat + " — the ledger format.\n\n" +
    "YOUR JOB\n" +
    "1. Build ALL pages per the sitemap in " + F.architecture + " — every page as a self-contained file under " + F.pagesDir + " (inline CSS/JS; base64-embed any images; zero external requests). The primary page is ALSO delivered at " + F.artifact + ". Every page honors the shared tokens verbatim; nav is identical on every page (links, order, active state); every page is reachable (no orphans); every page serves its sitemap purpose. Ledger entry #1 is the frozen brief (copy its 5 fields + S0 scope).\n" +
    "2. Maintain " + F.ledger + ": every significant decision gets id/date/decision/rationale/breaks-when (monotonic ids, never reused). Stare decisis on every standing entry you touch: APPLY / DISTINGUISH / OVERRULE — no silent fourth option. OVERRULE writes a superseding entry; history is never edited. Record rejected options: they are the critic's anti-relapse weapon.\n" +
    "2b. DELIBERATE DEVIATION (builder charter): you MAY deliberately deviate from the frozen brief or the direction — ONLY by logging a DEVIATION ledger entry FIRST (type: DEVIATION; quote the exact constraint broken; one-clause one-idea-service naming how the deviation serves the frozen One Idea BETTER than compliance would; breaks-when tripwire). A deviation that cannot name its service to the One Idea dies here. UNLOGGED deviation from a brief constraint is a tripwire breach.\n" +
    "3. PRODUCT IMAGERY: " + imageryLine + " You NEVER draw, illustrate, or SVG-approximate the product. If required product imagery is missing, STOP and report it in blocked_needs — do not invent a visual substitute.\n" +
    "4. Render your own work at 1440 / 768 / 375 (headless Chrome: --headless --no-sandbox --disable-dev-shm-usage --hide-scrollbars --screenshot=<path> --window-size=<W>,<H>) and LOOK at the renders (read the image files) before signaling ready. Render EVERY page, not just the primary. Shipping blind is a protocol violation.\n" +
    "5. Deliverables: every sitemap page as ONE self-contained file under " + F.pagesDir + " + the primary ALSO at " + F.artifact + " + the complete ledger at " + F.ledger + ".\n\n" +
    "FORBIDDEN: the nos corpus (" + MF.nosCorpus + "), the critic charter (" + MF.criticCharter + "), any prior defect lists. You build to the brief, not to the test.\n\n" +
    "Date for ledger entries: " + today + ".\n\n" +
    "RETURN your result as a JSON object with exactly these fields: artifact_path, ledger_path, build_ready, blocked_needs (array), pages (array of {slug, path} — EVERY sitemap page, built), key_decisions (array, max 5, one line each), render_verified (one line: what you rendered and looked at), notes.";
}

function renderPrompt(t, pages) {
  const extras = (pages || []).filter(function (p, i) { return i > 0; }); // index 0 is the primary page
  const extraLine = extras.length > 0
    ? "Also capture EVERY non-primary page at desktop 1440 and mobile 375: " +
      extras.map(function (p) { return p.slug + " (" + p.path + ")"; }).join(", ") +
      ". Save as " + F.rendersDir + t + "-<slug>-1440.png and " + F.rendersDir + t + "-<slug>-375.png. "
    : "";
  return "You are the RENDER TECHNICIAN for a craft-build run. One job: deterministic screenshots.\n\n" +
    "Read: " + MF.renderLoop + " (the Chrome recipe).\n\n" +
    "Capture " + F.artifact + " full-page at 3 viewports — desktop 1440, tablet 768, mobile 375 — with EXACTLY these flags: --headless --no-sandbox --disable-dev-shm-usage --ignore-certificate-errors --window-size=<W>,<H> --hide-scrollbars --screenshot=<path> (--disable-dev-shm-usage is load-bearing against OOM-kill).\n" +
    "Save to: " + F.rendersDir + t + "-1440.png, " + t + "-768.png, " + t + "-375.png\n" +
    extraLine +
    "Verify each file: (1) exists and is a valid PNG; (2) has the expected viewport width (1440/768/375); (3) exceeds 2KB (below = truncated/corrupt: retry once, then report ok:false)." +
    "BYTE SIZE IS NOT A VALIDITY SIGNAL: flat color-field designs PNG-compress to a few KB. Small files are EXPECTED, not failures. " +
    "Visually confirm each render shows the actual page, not a blank viewport or a Chrome error page. Only a genuinely blank or error render is a failure: retry once, then report ok:false." +
    "RETURN your result as a JSON object with exactly these fields: desktop, tablet, mobile, extra_pages (array of {slug, desktop, mobile}; empty when single-page), ok, note.";
}

function criticPrompt(round, prevCritiquePath) {
  const prior = round > 1
    ? "PRIOR ROUND: read " + prevCritiquePath + " and every disposition file in " + F.dispositionsDir + ". Verify EVERY P0 and P1 has a written disposition (accept / reject-with-reason / defer-with-date). A P0 with no disposition, or a rejected P0 the evidence still sustains, REMAINS a P0. Second rejection of the same P0 is not permitted.\n"
    : "";
  return "You are the CRITIC for a craft-build run (round " + round + "). Fresh context. Your job: kill-list, not fixes.\n\n" +
    "Read FIRST: " + MF.criticCharter + " — your charter (inputs, forbidden knowledge, kill-list format, relative-uniqueness gate, positive-thesis triad T1/T2/T3, density audit D1/D2/D3, disposition protocol).\n\n" +
    "YOUR INPUTS\n" +
    "- Frozen brief: " + F.brief + " — judge against this, never against anyone's retelling.\n" +
    "- Sitemap: " + F.architecture + " — every page's declared purpose; judge each page against its purpose.\n" +
    "- Renders (primary): " + R.desktop + ", " + R.tablet + ", " + R.mobile + " — judge from these, never from source alone.\n" +
    "- Extra page renders: " + (R.extraPages || []).map(function (p) { return p.slug + ": " + p.desktop + " / " + p.mobile; }).join(" | ") + "\n" +
    "- Norms corpus: " + MF.nosCorpus + " (N1–N20 slop-disgust, PF1–PF5 pre-flight, 40-second protocol TT-P1–TT-P4, copy specificity with number-trap guard, thesis triad).\n" +
    "- Artifact: " + F.artifact + "\n" +
    "- Ledger AS CONSTRAINTS ONLY: " + F.ledger + " — decisions + tripwires + rejected-options list. NEVER rationale narratives.\n" +
    "- Adversarial frame: find every way this fails.\n" + prior + "\n" +
    "FORBIDDEN: builder rationale, builder identity, prior attempt counts, builder self-assessment, intended-vs-shipped. Only what shipped exists.\n\n" +
    "PROCEDURE\n" +
    "1. Relative-uniqueness gate: would you arrive at this same solution for a similar prompt? Guessable-from-category (or category-plus-avoidance) fails.\n" +
    "2. Positive-thesis triad T1/T2/T3 — binding P0s (NO THESIS / THESIS ABANDONED / NO STAKES).\n" +
    "3. Density audit D1/D2/D3 — binding (D1 THIN is P0: if the page is fully describable after one glance as 'lines and text', it fails).\n" +
    "4. Full nos run: every N1–N20, PF1–PF5, TT-P1–TT-P4. A crit that finds zero nos has failed — look harder.\n" +
    "4b. CROSS-PAGE COHERENCE (multi-page runs): (a) every sitemap page exists and serves its declared purpose — a page that doesn't is P1; (b) nav identical on every page (links, order, labels, active state) — drift is P1; (c) shared design tokens honored on every page (typeface, palette, spacing per the architecture) — a page inventing its own tokens is P1; (d) no orphan pages (unreachable from nav or body links) — P1.\n" +
    "5. Tripwire attacks: every ledger breaks-when — does the signal fire?\n" +
    "5b. Logged DEVIATION entries: judge each against the frozen One Idea ON THE MERITS — never an automatic defect. A deviation whose justification names a real service to the One Idea, borne out by the renders, is NOT a defect (record as upheld; it may not be re-litigated). Vague/unsupported justification => P1. Deviation breaking FEEL->DO or making a generic default reachable again => P0. UNLOGGED deviation from a brief constraint => P0 tripwire breach.\n" +
    "6. Write the kill list to " + F.critique(round) + ": ranked P0/P1/P2, PROBLEMS NEVER FIXES, each with evidence (screenshot coords or element + rule id + observed vs expected). Scores are banned.\n\n" +
    "P0 = brief violation or visible breakage (blocks merge). P1 = norms violation weakening FEEL→DO (must be dispositioned before the next pass sequence). P2 = polish (may defer with date).\n\n" +
    "RETURN your result as a JSON object with exactly these fields: p0_count, p1_count, p2_count, critique_path, p1_all_dispositioned, summary (one line: the single most damning finding, or 'clean').";
}

function repairPrompt(critiquePath) {
  return "You are the BUILDER for a craft-build run, repair round. Fresh context.\n\n" +
    "Read FIRST:\n- " + MF.builderCharter + " — standing orders.\n" +
    "- " + F.brief + " — FROZEN. You may not rewrite the brief. A finding against the brief itself is reported back in notes, not fixed.\n" +
    "- " + F.ledger + " — the current ledger (append; OVERRULE with reason, never edit history).\n" +
    "- " + F.architecture + " — the sitemap (multi-page runs: apply dispositions to every affected page).\n" +
    "- The kill list, VERBATIM (the orchestrator relays it unchanged — do not reinterpret): " + critiquePath + "\n\n" +
    "YOUR JOB\n" +
    "1. For EVERY P0 and EVERY P1 in the kill list, write a disposition file under " + F.dispositionsDir + " (one file per finding, named <finding-id>.md): ACCEPT (and what you will change), REJECT-WITH-REASON (evidence the finding is wrong), or DEFER-WITH-DATE. A finding merely noted is a decline. Second rejection of the same P0 is not permitted.\n" +
    "2. Revise " + F.artifact + " per your ACCEPT dispositions. Minimal edits honoring stare decisis.\n" +
    "3. Re-render at 1440/768/375 yourself and LOOK before signaling done.\n" +
    "4. Append disposition entries to the ledger.\n\n" +
    "RETURN your result as a JSON object with exactly these fields: artifact_path, dispositions_written, p0_dispositioned, p1_dispositioned, notes.";
}

// Per-pass checklists, inlined from passes.md (cold context — never "see history").
const PASS_INFO = {
  p1: { title: "P1 — Structure",
    job: "Does the skeleton answer the brief? Checklist: (1) every brief requirement maps to a visible block; (2) no orphan blocks (visible but unrequired); (3) no invented claims (required but unverified); (4) information hierarchy matches the brief's FEEL→DO; (5) BOUNDED COMPOSITION: the page reads as a finite, bounded object — endless scroll is a structural defect unless the brief demands it. (6) MULTI-PAGE: every sitemap page is built and serves its declared purpose; no orphan pages (unreachable from nav or body links); every built page appears in the sitemap. NOT-checks: do not fix copy, pixels, or motion — structure only. Exit: all requirements mapped, zero orphans, zero invented claims, composition bounded, sitemap fully honored. Invalidation: any structural change forces P3–P5 re-runs." },
  p2: { title: "P2 — Copy",
    job: "Every word correct. Checklist: zero placeholders; tone matches the brief (run the Adjective Negation test on the actual copy); every claim verified against a source; copy-specificity: every stat anchored (source/date/method) or it counts against — never reward bare numbers; banned vocabulary: seamless, elevate, delve, unlock, supercharge, cutting-edge, plus any brief-banned terms. NOT-checks: you judge WHAT the words say; you do not restyle, restructure, or fix rendering. Exit: no placeholders, tone passes, all claims sourced." },
  p3: { title: "P3 — Robustness",
    job: "Nothing breaks off the happy path. Checklist: render 1440/768/375 yourself; empty, loading, error, and overflow states reviewed; a11y thresholds pass (contrast AA, visible focus, skip link, exactly one h1 in the rendered DOM, reduced-motion path exists); no layout shift between states. PERFORMANCE GATE (BLOCKING): read ONLY the outline at performance/GATE_SPEC.md — budgets, gates, checkable rules (small context, never the whole repo). If a check needs technique depth, read the single relevant file under performance/ on demand (progressive disclosure — never a context dump). Over-budget findings are P1-class defects: fix or disposition like any other. If GATE_SPEC.md does not exist yet, apply the fallback: verify zero external requests (self-contained), measure total bytes and image bytes, flag total >2MB as P1; note 'GATE_SPEC pending' in the report. NOT-checks: do not restyle — breakage only. Exit: every state renders without breakage at every viewport, performance gate clean." },
  p4: { title: "P4 — Surface/craft",
    job: "Pixel-level correctness, ONE ERROR CLASS PER SWEEP, in this order: (1) alignment sweep, (2) spacing sweep, (3) type sweep, (4) color sweep, (5) CROSS-PAGE sweep (multi-page runs): nav byte-identical across pages except active state (links, order, labels); shared tokens honored on every page per the architecture token table (typeface, palette, spacing, radius) — a page inventing its own tokens fails; no visual drift between pages. Checklist per sweep — mechanical pre-flight: PF2 eyebrow cap <=4; PF3 no >=4 consecutive identical section triples; PF4 <2 template skeletons; PF1 no shared typeface with previous projects; TT-P2 exactly one h1 in rendered DOM; TT-P4 title <=60 chars. NOT-checks: do not restructure, rewrite copy, or add motion. Exit: all five sweeps clean." },
  p5: { title: "P5 — Motion",
    job: "Every transition exercised on the final build. Checklist: durations in budget (micro-interactions 100–300ms; nothing routine >500ms); enter decelerates, exit accelerates; scroll behavior matches the brief; reduced-motion path verified by actually rendering it; zero animation-dependent content (everything fully visible in a static capture). NOT-checks: do not add motion to fix static problems. Exit: all transitions within budget, reduced-motion verified." },
  p6: { title: "P6 — Adversarial",
    job: "Attack the FINISHED artifact, not a draft. Method: pre-mortem allowed ('a year later this failed — why?'). Checklist: (1) every N1–N20 as 'does this fire?'; (2) 40-second protocol TT-P1–TT-P4 (>=2 fails = rushed); (3) assumption attacks: every ledger tripwire — does the breaks-when fire?; (4) relative-uniqueness gate re-run; (5) thesis triad T1/T2/T3 re-run; (6) density audit D1/D2/D3 re-run. Non-overlap: you attack assumptions, not correctness. YOU NEVER FIX — findings route to the owning pass (one of P1–P5). Exit: zero new attack findings, or all findings routed." },
  p8: { title: "P8 — Elevation",
    job: "From 'no defects' to 'amazing'. Cold start: brief + final renders + the bar (direction/bar.md: abstracted bar-lessons + YES_CORPUS exemplar names and excellence claims). NOT the ledger, NOT prior defect lists. One question: what is the SINGLE biggest gap between this artifact and the best work in this genre? Concrete, locatable, one gap only. If no meaningful gap exists, report 'no gap'. Exactly one bounded builder round addresses the gap, then P3/P4/P5 re-verify. No loops. NOT-checks: do not re-litigate P1–P7; do not add unbriefed scope; do not chase a second gap. Exit: gap addressed + P3/P4/P5 clean, or 'no gap'." }
};

function passPrompt(p, seqNum) {
  const info = PASS_INFO[p];
  return "You are PASS " + info.title + " for a craft-build run (sequence " + seqNum + "). Cold start: brief + artifact + renders + your checklist. Nothing else — no prior pass reports, no history. This fixation reset is intentional.\n\n" +
    "Read:\n- Brief (frozen): " + F.brief + "\n- Sitemap: " + F.architecture + " (every page's declared purpose)\n- Artifact (primary): " + F.artifact + "\n- Renders (primary): " + R.desktop + ", " + R.tablet + ", " + R.mobile + "\n- Extra page renders: " + (R.extraPages || []).map(function (p) { return p.slug + ": " + p.desktop + " / " + p.mobile; }).join(" | ") + "\n- Ledger (decisions + tripwires ONLY, never rationale narratives): " + F.ledger + "\n- Your checklist: " + info.job + "\n\n" +
    "Bounded loop: collect defects → fix batch → one confirmation render (1440, look at it) → stop. 'Not substantially improving, just tinkering' = stop. Fix in the artifact; record each fix as a ledger entry (" + p + "-<NN> ids).\n" +
    "P0/P1-CLASS HONESTY: report p0p1_surfaced = how many defects you found that are P0/P1-class (brief violation, visible breakage, norms violation weakening FEEL→DO, thinness). Be honest — the stop rule depends on it.\n" +
    "Write your pass report to " + F.passesDir + p + "-seq" + seqNum + ".md (defects with evidence, or CLEAN with the checklist signed off item by item — 'looks good' is not a report).\n\n" +
    "RETURN your result as a JSON object with exactly these fields: defects_found, defects_fixed, p0p1_surfaced, exit_clean, changes (one of: none, copy, surface, structural, motion), pixels_moved, report_path, notes.";
}

function p6Prompt(seqNum, advRound, priorFindings) {
  const info = PASS_INFO.p6;
  const prior = priorFindings ? "PRIOR ADVERSARIAL ROUND findings (verify the routed fixes landed; only NEW or surviving findings count): " + priorFindings + "\n" : "";
  return "You are PASS " + info.title + " for a craft-build run (sequence " + seqNum + ", adversarial round " + advRound + "). Cold start.\n\n" +
    "Read:\n- Brief (frozen): " + F.brief + "\n- Artifact: " + F.artifact + "\n- Renders: " + R.desktop + ", " + R.tablet + ", " + R.mobile + "\n- Norms corpus: " + MF.nosCorpus + "\n- Ledger (decisions + tripwires ONLY): " + F.ledger + "\n- Your checklist: " + info.job + "\n" + prior + "\n" +
    "Write your report to " + F.passesDir + "p6-seq" + seqNum + "-r" + advRound + ".md.\n\n" +
    "RETURN your result as a JSON object with exactly these fields: findings (array of {severity: P0|P1|P2, owning_pass: one of p1|p2|p3|p4|p5, description}), exit_clean, report_path, notes.";
}

function owningPassPrompt(f, seqNum) {
  const info = PASS_INFO[f.owning_pass];
  return "You are PASS " + info.title + " for a craft-build run, routed a finding from the adversarial pass. Cold start.\n\n" +
    "Read: brief " + F.brief + " (frozen), sitemap " + F.architecture + ", artifact " + F.artifact + ", renders " + R.desktop + " / " + R.tablet + " / " + R.mobile + ", ledger " + F.ledger + " (decisions + tripwires only), your checklist: " + info.job + "\n\n" +
    "THE ROUTED FINDING (verbatim, severity " + f.severity + "): " + f.description + "\n\n" +
    "Fix it within your pass's remit — your NOT-checks still bind. Multi-page runs: apply to every affected page per the sitemap. If the fix needs another pass's remit, say so in notes and fix only your part. Bounded loop: fix → one confirmation render (1440, look) → stop. Record as ledger entry (" + f.owning_pass + "-R<NN> ids).\n" +
    "Write your report to " + F.passesDir + f.owning_pass + "-advfix-seq" + seqNum + ".md.\n\n" +
    "RETURN your result as a JSON object with exactly these fields: defects_found, defects_fixed, p0p1_surfaced, exit_clean, changes (one of: none, copy, surface, structural, motion), pixels_moved, report_path, notes.";
}

function p7Prompt(seqNum) {
  return "You are PASS P7 — FRESH-EYES for a craft-build run (sequence " + seqNum + "). You have never seen this project. Your ONLY inputs: the brief and the renders. Zero chain-of-thought, zero prior defect lists, zero ledger.\n\n" +
    "Read ONLY:\n- Brief: " + F.brief + "\n- Renders: read the MOBILE render FIRST (" + R.mobile + ") — format shift — then " + R.desktop + ".\n\n" +
    "Answer: (1) state the artifact's aesthetic thesis in <=5 words, no quality adjectives — can you? (2) does every element serve it, or are there passengers? (3) could a reasonable viewer dislike it FOR its thesis? (4) does the brief's FEEL→DO hold?\n" +
    "Then give your disposition in EXACTLY one word: recapture (thesis/brief wrong — start the concept over) / rebuild (execution wrong — same brief, new build) / fix (list every defect below as a concrete work order) / ship (it holds). Unsoftenable.\n\n" +
    "RETURN your result as a JSON object with exactly these fields: disposition, work_order (array of strings; empty if ship), notes (<=5 sentences if not ship).";
}

function reworkPrompt(p7) {
  return "You are the BUILDER for a craft-build run, rework round. Fresh context.\n\n" +
    "Read: " + MF.builderCharter + " (standing orders), frozen brief " + F.brief + " (do NOT rewrite it), ledger " + F.ledger + ", abstractions " + F.abstractions + ", materiality " + F.materiality + ", sitemap " + F.architecture + ".\n\n" +
    "THE FRESH-EYES WORK ORDER (verbatim — disposition: " + p7.disposition + "): " + (p7.work_order || []).join(" | ") + "\n\n" +
    "Execute the work order with minimal edits honoring stare decisis (APPLY / DISTINGUISH / OVERRULE on touched entries; append, never rewrite history). Multi-page runs: apply to every affected page per the sitemap. Re-render at 1440/768/375 yourself and LOOK before signaling done.\n\n" +
    "RETURN your result as a JSON object with exactly these fields: artifact_path, notes.";
}

function p8Prompt() {
  const barLine = "The bar: " + F.bar + " (abstracted bar-lessons + YES_CORPUS exemplar names and excellence claims).";
  return "You are PASS P8 — ELEVATION for a craft-build run. Cold start: you have never seen this project. Your inputs are ONLY the brief, the final renders, and the bar. You do not see the ledger, prior defect lists, or any pass reports — you judge against EXCELLENCE, not against the absence of failure.\n\n" +
    "Read ONLY:\n- Brief (frozen): " + F.brief + "\n- Final renders: " + R.desktop + " (desktop), " + R.mobile + " (mobile first — format shift), " + R.tablet + "\n- Extra page renders: " + (R.extraPages || []).map(function (p) { return p.slug + ": " + p.desktop + " / " + p.mobile; }).join(" | ") + "\n- " + barLine + "\n\n" +
    "Answer ONE question: what is the SINGLE biggest gap between this artifact and the best work in this genre? Concrete, locatable (name the element/region), one gap only — not a list. Compare against the bar: what would the exemplary sites do here that this doesn't?\n" +
    "If no meaningful gap exists — if this genuinely stands with the bar — report gap_found=false with the single word: no gap.\n\n" +
    "Write your report to " + F.passesDir + "p8-elevation.md.\n\n" +
    "RETURN your result as a JSON object with exactly these fields: gap_found (boolean), gap_description (one concrete gap, or 'no gap'), report_path, notes.";
}

function elevationReworkPrompt(gap) {
  return "You are the BUILDER for a craft-build run, ELEVATION round. Fresh context. Exactly ONE bounded round — no loops.\n\n" +
    "Read: " + MF.builderCharter + " (standing orders), frozen brief " + F.brief + " (do NOT rewrite it), ledger " + F.ledger + " (append; OVERRULE with reason, never rewrite history), abstractions " + F.abstractions + ", materiality " + F.materiality + ", sitemap " + F.architecture + ".\n\n" +
    "THE ELEVATION GAP (verbatim, from the P8 elevation pass): " + gap + "\n\n" +
    "Address ONLY this gap, with minimal edits honoring stare decisis. Do not re-litigate P1–P7 findings. Do not add scope the brief didn't earn. If the run is multi-page, apply to every affected page. Log the work as P8-E## ledger entries. Re-render at 1440/768/375 yourself and LOOK before signaling done.\n\n" +
    "RETURN your result as a JSON object with exactly these fields: artifact_path, changes (what you changed, one paragraph), notes.";
}

function authorPrompt() {
  return "You are the COPY AUTHOR for a craft-build run (P8 author step). Cold start. You are a WRITER, not a checker — your job is voice, rhythm, and memorability, not defect-hunting.\n\n" +
    "Read:\n- Brief (frozen): " + F.brief + " — its F5 FEEL→DO is your compass: every line of copy must produce the FEEL and drive the DO.\n- Artifact: " + F.artifact + " (primary page; multi-page runs: every page under " + F.pagesDir + " per the sitemap " + F.architecture + ")\n- Renders: " + R.desktop + ", " + R.mobile + " — see how the words sit.\n\n" +
    "YOUR JOB — one bounded authoring round: REWRITE the page copy for voice, rhythm, and memorability. Read every line aloud in your head. Kill the flat, the generic, the committee-written. The brief's tone (run its Adjective Negation test on your rewrite) governs; the One Idea governs most.\n" +
    "HARD CONSTRAINTS: invent NOTHING — every factual claim in your rewrite must already exist on the page (no new stats, names, or promises); keep every sourced claim intact; do not move the FEEL→DO; do not restructure the page (words and sentences only — P1 owns structure); keep it brief-true (a line that breaks a NOT-list item dies no matter how pretty).\n" +
    "Log the rewrite as P8-A## ledger entries (what changed and why, in voice terms). Re-render at 1440/768/375 yourself and LOOK — your words must not break the layout.\n\n" +
    "RETURN your result as a JSON object with exactly these fields: artifact_path, changes_summary (what you rewrote and the voice decision behind it), notes.";
}

function learnPrompt(verdict) {
  return "You are the VERDICT ENCODER for a craft-build run. The human (F1) has judged the artifact. Your job: turn the verdict into DURABLE machine lessons. Read " + MF.verdictProtocol + " — the procedure — first.\n\n" +
    "Read:\n- The verdict (verbatim, from the human): " + verdict + "\n- The frozen brief: " + F.brief + "\n- The run ledger: " + F.ledger + " (decisions, tripwires, rejected options)\n- The machine files you may propose edits to: " + MF.nosCorpus + ", " + MF.yesCorpus + ", " + MF.briefTemplate + ", " + MF.builderCharter + ", " + MF.criticCharter + ", " + MF.passes + "\n\n" +
    "YOUR JOB — write " + F.learn + " containing CONCRETE PROPOSED EDITS, each with: (1) target file, (2) location anchor (section/line), (3) exact new text, (4) the verdict quote (or ledger entry) that evidences it, (5) confidence (high/medium/low). You PROPOSE — a human applies. Be conservative: no verdict content, no proposal. A clean 'ship' still teaches: name what WORKED (load-bearing decisions the verdict implies) as proposed standing directives or yes-corpus entries.\n" +
    "FORBIDDEN: editing the machine files yourself; inventing lessons; rewriting history.\n\n" +
    "RETURN your result as a JSON object with exactly these fields: lessons_path, summary (what the verdict taught, 2–4 sentences), proposals (array of one-line proposal summaries).";
}

// ---------------------------------------------------------------------------
// Phase runners
// ---------------------------------------------------------------------------
let R = { desktop: "", tablet: "", mobile: "", extraPages: [] };
let renderN = 0;
let tag = ""; // "-g2" after a recapture regeneration

async function doRender() {
  renderN++;
  const t = "r" + renderN;
  let r = await agent(renderPrompt(t, sitePages), {
    key: "render-" + renderN + tag, label: "Render " + t, timeoutMs: 900000, schema: RENDER_SCHEMA });
  if (!r.ok) {
    log("Render " + t + " failed verification — one retry");
    r = await agent(renderPrompt(t, sitePages), {
      key: "render-" + renderN + "b" + tag, label: "Render " + t + " (retry)", timeoutMs: 900000, schema: RENDER_SCHEMA });
    if (!r.ok) throw new Error("render failed twice for tag " + t + ": " + r.note);
  }
  R = { desktop: r.desktop, tablet: r.tablet, mobile: r.mobile, extraPages: r.extra_pages || [] };
  return r;
}

async function doBrief(feedback) {
  phase("brief");
  for (let attempt = 1; attempt <= 2; attempt++) {
    const b = await agent(briefPrompt(feedback, attempt), {
      key: "brief-" + attempt + tag, label: "Brief writer", timeoutMs: 1800000, schema: BRIEF_SCHEMA });
    const t = b.tests_passed;
    if (t.audience_flip && t.not_list_sweep && t.adjective_negation) {
      log("Brief frozen: " + b.one_idea);
      return b;
    }
    const failed = [];
    if (!t.audience_flip) failed.push("Audience Flip");
    if (!t.not_list_sweep) failed.push("Not-List Sweep");
    if (!t.adjective_negation) failed.push("Adjective Negation");
    feedback = "Your previous draft failed: " + failed.join(", ") + ". Rewrite the brief; the tests do not bend.";
    log("Brief attempt " + attempt + " failed (" + failed.join(", ") + ") — rewriting");
  }
  return blocked("brief-failed", "Brief-writer failed an unreachability test twice. Re-brief by hand, then relaunch.");
}

async function doDirection() {
  phase("direction");
  // Tournament: three direction retrievers (divergent provocations) + the
  // materiality retriever, all in parallel. The judge picks ONE winner.
  const thunks = DIRECTION_ANGLES.map(function (angle) {
    return function () { return agent(directionPrompt(angle), {
      key: "direction-" + angle.letter + "-1" + tag,
      label: "Direction retriever (" + angle.name + ")", phase: "direction",
      timeoutMs: 1800000, schema: DIRECTION_SCHEMA }); };
  });
  thunks.push(function () { return agent(materialityPrompt(), {
    key: "materiality-1" + tag, label: "Materiality retriever", phase: "direction",
    timeoutMs: 1800000, schema: MATERIALITY_SCHEMA }); });
  const results = await parallel(thunks, { concurrency: 4 });
  const dirs = [results[0], results[1], results[2]];
  const materiality = results[3];
  if (!dirs[0] || !dirs[1] || !dirs[2] || !materiality)
    throw new Error("direction phase: a retriever failed");
  const judge = await agent(judgePrompt(dirs.map(function (d) { return d.direction_paragraph; })), {
    key: "direction-judge-1" + tag, label: "Direction judge",
    timeoutMs: 1800000, schema: JUDGE_SCHEMA });
  const wi = { a: 0, b: 1, c: 2 }[judge.winner];
  if (wi === undefined) throw new Error("direction judge returned no winner");
  const winner = dirs[wi];
  log("Direction tournament winner: " + DIRECTION_ANGLES[wi].name + " — " + judge.reasoning);
  const need = winner.imagery_required || [];
  const have = inputs.imagery_paths || [];
  if (need.length > 0 && have.length === 0) {
    return blocked("imagery-missing",
      "The winning direction requires product imagery (" + need.join("; ") + ") and none was supplied. " +
      "Generate or supply these photographs, then relaunch with args.imagery_paths set " +
      "(use resumeFromRunId to reuse completed phases). The builder will never draw the product.");
  }
  log("Direction committed.");
  return { direction: winner, materiality: materiality, judge: judge };
}

let sitePages = []; // [{slug, path, purpose}] — set by doArchitect, read by render/critic/passes

async function doArchitect() {
  phase("architect");
  const a = await agent(architectPrompt(), {
    key: "architect-1" + tag, label: "Site architect",
    timeoutMs: 1800000, schema: ARCHITECT_SCHEMA });
  if (!a.pages || a.pages.length === 0) throw new Error("architect phase: no pages declared");
  sitePages = a.pages;
  log("Architecture committed: " + a.pages.length + " page(s) — " +
    a.pages.map(function (p) { return p.slug; }).join(", "));
  return a;
}

async function doBuild() {
  phase("build");
  const b = await agent(buildPrompt(), {
    key: "build-1" + tag, label: "Builder", timeoutMs: 2700000, schema: BUILD_SCHEMA });
  if ((b.blocked_needs || []).length > 0) {
    return blocked("imagery-missing",
      "Builder blocked on missing product imagery: " + b.blocked_needs.join("; ") +
      ". Supply via args.imagery_paths and relaunch (resumeFromRunId reuses completed phases).");
  }
  if (!b.build_ready) {
    return blocked("build-not-ready", "Builder did not signal ready: " + (b.notes || "no notes") + ". Artifact: " + b.artifact_path);
  }
  const builtSlugs = (b.pages || []).map(function (p) { return p.slug; });
  const missing = sitePages.filter(function (p) { return builtSlugs.indexOf(p.slug) < 0; });
  if (missing.length > 0) {
    return blocked("build-incomplete",
      "Builder did not build every sitemap page. Missing: " +
      missing.map(function (p) { return p.slug; }).join(", ") +
      ". The sitemap is binding: no more pages, no fewer.");
  }
  log("Build ready: " + (b.key_decisions || []).length + " key decisions recorded");
  return b;
}

async function doCriticLoop() {
  phase("critic");
  let round = 0;
  let prevCritique = "";
  while (true) {
    round++;
    log("Critic round " + round);
    const c = await agent(criticPrompt(round, prevCritique), {
      key: "critic-" + round + tag, label: "Critic round " + round,
      timeoutMs: 1800000, schema: CRITIC_SCHEMA });
    prevCritique = c.critique_path;
    if (c.p0_count === 0 && c.p1_all_dispositioned) {
      log("Critic gate passed on round " + round + " (" + c.p2_count + " P2s logged)");
      return c;
    }
    if (round >= maxCriticRounds) {
      return blocked("critic-deadlock",
        "Critic still reports P0=" + c.p0_count + " after " + maxCriticRounds + " rounds. " +
        "Kill list: " + c.critique_path + ". Escalate to F1 with the brief clause, kill lists, dispositions, and renders — human breaks the tie.");
    }
    log("Repair round " + round + ": P0=" + c.p0_count + ", P1=" + c.p1_count);
    await agent(repairPrompt(c.critique_path), {
      key: "repair-" + round + tag, label: "Builder repair round " + round,
      timeoutMs: 1800000, schema: REPAIR_SCHEMA });
    await doRender();
  }
}

async function runPass(p, seqNum, suffix) {
  const key = "pass-" + p + "-seq" + seqNum + (suffix || "");
  const r = await agent(passPrompt(p, seqNum), {
    key: key, label: "Pass " + p.toUpperCase() + " (seq " + seqNum + (suffix || "") + ")",
    timeoutMs: 1500000, schema: PASS_SCHEMA });
  return r;
}

async function doPassSequence(seqNum) {
  let defects = 0;
  const order = ["p1", "p2", "p3", "p4", "p5"];
  for (const p of order) {
    const r = await runPass(p, seqNum, "");
    if (!r.exit_clean) {
      return blocked("pass-not-clean",
        "Pass " + p.toUpperCase() + " could not exit clean: " + (r.notes || "no notes") + ". Report: " + r.report_path);
    }
    defects += r.p0p1_surfaced || 0;
    if (p === "p3" && r.pixels_moved) {
      log("P3 moved pixels — re-running P4");
      const r4 = await runPass("p4", seqNum, "-rerun");
      if (!r4.exit_clean) return blocked("pass-not-clean", "P4 re-run could not exit clean. Report: " + r4.report_path);
      defects += r4.p0p1_surfaced || 0;
    }
    if (r.changes === "structural" && p !== "p1") {
      log("Late structural change in " + p.toUpperCase() + " — re-running P3–P5");
      const qs = ["p3", "p4", "p5"];
      for (const q of qs) {
        const rq = await runPass(q, seqNum, "-inval");
        if (!rq.exit_clean) return blocked("pass-not-clean", "Invalidation re-run " + q.toUpperCase() + " could not exit clean.");
        defects += rq.p0p1_surfaced || 0;
      }
    }
    if (p === "p5" && r.changes === "motion") {
      log("P5 changed motion — re-checking P3 layout shift");
      const r3 = await runPass("p3", seqNum, "-rerun");
      if (!r3.exit_clean) return blocked("pass-not-clean", "P3 re-check could not exit clean.");
      defects += r3.p0p1_surfaced || 0;
    }
  }
  // P6 adversarial loop (bounded at 2 rounds)
  let adv = 0;
  let prior = "";
  while (true) {
    adv++;
    const p6 = await agent(p6Prompt(seqNum, adv, prior), {
      key: "pass-p6-seq" + seqNum + "-r" + adv + tag, label: "Pass P6 adversarial (seq " + seqNum + ", r" + adv + ")",
      timeoutMs: 1500000, schema: P6_SCHEMA });
    const sev = (p6.findings || []).filter(function (f) { return f.severity === "P0" || f.severity === "P1"; });
    defects += sev.length;
    if (sev.length === 0) { log("P6 clean"); break; }
    if (adv >= 2) {
      return blocked("adversarial-deadlock",
        "P6 still surfaces P0/P1 findings after 2 adversarial rounds: " +
        sev.map(function (f) { return "[" + f.severity + "] " + f.description; }).join(" | ") +
        ". Report: " + p6.report_path);
    }
    log("P6 routed " + sev.length + " finding(s) to owning passes");
    const rank = { p1: 0, p2: 1, p3: 2, p4: 3, p5: 4 };
    sev.sort(function (a, b) {
      const ra = rank[a.owning_pass] === undefined ? 9 : rank[a.owning_pass];
      const rb = rank[b.owning_pass] === undefined ? 9 : rank[b.owning_pass];
      return ra - rb;
    });
    for (const f of sev) {
      await agent(owningPassPrompt(f, seqNum), {
        key: "pass-" + f.owning_pass + "-advfix-seq" + seqNum + "-r" + adv + tag,
        label: "Pass " + f.owning_pass.toUpperCase() + " adversarial fix",
        timeoutMs: 1500000, schema: PASS_SCHEMA });
    }
    await doRender();
    prior = sev.map(function (f) { return "[" + f.severity + "/" + f.owning_pass + "] " + f.description; }).join(" | ");
  }
  // P7 fresh-eyes
  const p7 = await agent(p7Prompt(seqNum), {
    key: "pass-p7-seq" + seqNum + tag, label: "Pass P7 fresh-eyes (seq " + seqNum + ")",
    timeoutMs: 1200000, schema: P7_SCHEMA });
  return { defects: defects, p7: p7 };
}

async function doElevation() {
  phase("p8");
  const p8 = await agent(p8Prompt(), {
    key: "pass-p8-elevate" + tag, label: "Pass P8 elevation",
    timeoutMs: 1500000, schema: P8_SCHEMA });
  log("P8 report: " + p8.report_path);
  if (p8.gap_found) {
    log("P8 gap: " + p8.gap_description + " — one bounded elevation round");
    await agent(elevationReworkPrompt(p8.gap_description), {
      key: "elevate-rework" + tag, label: "P8 elevation rework",
      timeoutMs: 1800000, schema: ELEVATION_REWORK_SCHEMA });
  } else {
    log("P8: no meaningful gap — proceeding to authorship");
  }
  // AUTHOR step: cold copy-author rewrites for voice, rhythm, memorability.
  // Runs in every P8 (copy voice is independent of the visual gap).
  await agent(authorPrompt(), {
    key: "p8-author" + tag, label: "P8 copy author",
    timeoutMs: 1500000, schema: AUTHOR_SCHEMA });
  await doRender();
  // Targeted re-verification: P2 (new copy), P3 (robustness incl. perf gate),
  // P4 (surface), P5 (motion). Exactly one round — not clean => blocked.
  const verify = ["p2", "p3", "p4", "p5"];
  for (const p of verify) {
    const r = await runPass(p, 0, "-p8");
    if (!r.exit_clean) {
      return blocked("elevation-not-clean",
        "P8 re-verification " + p.toUpperCase() + " could not exit clean: " +
        (r.notes || "no notes") + ". Report: " + r.report_path +
        ". No loops — escalate to F1.");
    }
  }
  log("P8 elevation + authorship verified clean.");
  return { elevated: !!p8.gap_found };
}

async function doLearn(verdict) {
  phase("learn");
  const l = await agent(learnPrompt(verdict), {
    key: "learn-1" + tag, label: "Verdict encoder",
    timeoutMs: 1800000, schema: LEARN_SCHEMA });
  log("Verdict lessons proposed: " + l.lessons_path);
  return l;
}

// ---------------------------------------------------------------------------
// Main flow
// ---------------------------------------------------------------------------
if (!inputs.subject) {
  return blocked("missing-input",
    "args.subject is required: what to build (e.g. 'a website for ...'). " +
    "Optional: args.audience, args.run_name, args.today, args.imagery_paths, " +
    "args.prior_failures, args.f1_verdict (relaunch-only: verdict text for the learn phase), " +
    "args.budgets {max_critic_rounds, max_sequences}.");
}

let step = await doBrief(null);
if (isBlocked(step)) return step;

step = await doDirection();
if (isBlocked(step)) return step;

step = await doArchitect();
if (isBlocked(step)) return step;

step = await doBuild();
if (isBlocked(step)) return step;

await doRender();

step = await doCriticLoop();
if (isBlocked(step)) return step;

let cleanSequences = 0;
let seq = 0;
while (cleanSequences < 2) {
  seq++;
  if (seq > maxSequences) {
    return blocked("sequence-budget",
      "Exceeded max_sequences (" + maxSequences + ") without two consecutive clean pass sequences. " +
      "Current artifact: " + F.artifact + ". Escalate to F1.");
  }
  log("Pass sequence " + seq + " begins");
  const s = await doPassSequence(seq);
  if (isBlocked(s)) return s;
  const disp = s.p7.disposition;
  if (disp !== "ship") {
    log("P7 disposition: " + disp + " — routing work order");
    if (disp === "recapture") {
      if (tag !== "") {
        return blocked("recapture-budget",
          "Fresh-eyes requested a second recapture; the concept was rejected twice. " +
          "Artifact: " + F.artifact + ". Escalate to F1.");
      }
      tag = "-g2";
      step = await doBrief("Fresh-eyes recapture — the thesis/concept was rejected: " + (s.p7.work_order || []).join(" | "));
      if (isBlocked(step)) return step;
      step = await doDirection();
      if (isBlocked(step)) return step;
      step = await doArchitect();
      if (isBlocked(step)) return step;
      step = await doBuild();
      if (isBlocked(step)) return step;
      await doRender();
      step = await doCriticLoop();
      if (isBlocked(step)) return step;
    } else {
      await agent(reworkPrompt(s.p7), {
        key: "rework-seq" + seq + tag, label: "Rework (P7: " + disp + ")",
        timeoutMs: 1800000, schema: REWORK_SCHEMA });
      await doRender();
    }
    continue;
  }
  if (s.defects === 0) {
    cleanSequences++;
    log("Clean pass sequence " + cleanSequences + " of 2");
  } else {
    cleanSequences = 0;
    log("Sequence surfaced " + s.defects + " P0/P1-class defect(s); clean counter reset");
  }
}

phase("p8");
step = await doElevation();
if (isBlocked(step)) return step;

phase("f1");
if (inputs.f1_verdict) {
  const learned = await doLearn(inputs.f1_verdict);
  if (isBlocked(learned)) return learned;
  return {
    status: "complete",
    artifact: F.artifact,
    pages: sitePages.map(function (p) { return p.path; }),
    verdict_lessons: learned.lessons_path,
    summary: learned.summary,
    message: "craft-build '" + runName + "' complete. Verdict encoded — review proposals at " +
      learned.lessons_path + " and apply approved edits to the machine files per " +
      MF.verdictProtocol + "."
  };
}
return blocked("f1-verdict",
  "craft-build '" + runName + "' is ready for your verdict. Artifact: " + F.artifact +
  " Renders: " + R.desktop + " " + R.mobile +
  ". Open it and judge the rendered thing. " +
  "After the verdict, relaunch with resumeFromRunId=<this run> and args.f1_verdict set to the verdict text (verbatim) plus the flip-question answer — the learn phase will encode it into verdict-lessons.md for your review.");