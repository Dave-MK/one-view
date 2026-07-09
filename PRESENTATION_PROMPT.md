# Prompt: generate a OneView presentation walkthrough

Copy everything below the line into a fresh Claude conversation (or any
AI design/slide tool that accepts image attachments), **with the 13
screenshots from the "Scene screenshots" section attached in order**. They
were captured live from the deployed app and are the visual source of truth —
don't invent or restyle UI that isn't in them.

---

## The prompt

You are designing a **presentation walkthrough** of OneView, a coordination-layer
product for health, social care and education. Produce a self-contained,
visually polished slide deck (a single HTML file with CSS, 16:9 slides,
click/arrow-key or scroll navigation, no external dependencies/build step) that
tells the product's story using the **13 attached screenshots** as the visual
evidence for each beat. This is a stakeholder/commissioner-facing deck — the
audience is local authority, NHS and Combined Authority decision-makers, not
developers. Confident, plain-English, no jargon beyond what's defined on screen.

### Source material

- **The screenshots** (attached, in this order) are real captures of the live
  product, not mockups. Use them as hero images — don't redraw the UI.
- **The narrative** below is condensed from a longer walkthrough script;
  use it for slide headlines, body copy and speaker notes.
- **Brand/style tokens**, listed further down, are OneView's actual design
  system — match them so the deck feels like an extension of the product,
  not a generic template.

### Slide-by-slide content

Build one slide per scene unless noted. Each entry gives: the screenshot to
use, a suggested headline, body copy / annotation, and speaker notes (for the
presenter, not necessarily shown on the slide itself).

**0. Title slide** (no screenshot — design this one from the brand tokens)
- Headline: "OneView"
- Subhead: "A coordination layer for people-centred services"
- Small line: "Prototype walkthrough"

**1. Screenshot: landing hero** (`scene-01-landing-hero`)
- Headline: "Not another portal — a coordination layer"
- Body: "OneView brings the right people and the right information together to coordinate support around what matters most — the person."
- Speaker notes: Position against case-management systems immediately — this is the single most important framing of the whole deck. Two clear entry points: citizens/families, and professionals.

**2. Screenshot: two worlds, one shared layer** (`scene-02-two-worlds`)
- Headline: "Two worlds, one shared layer"
- Body: "Service users and the organisations supporting them sit on either side. Nothing here replaces existing systems — it coordinates between them." List the shared-layer components shown (Timeline, Tasks, Documents, Meetings, Messaging, Audit, Governance…).
- Speaker notes: Emphasise "coordinate, don't duplicate" — records of care stay in source systems; OneView is the system of record for coordination only.

**3. Screenshot: one layer, many contexts** (`scene-03-domains-governance`)
- Headline: "One layer, many contexts"
- Body: Call out the three domain cards (SEND / Adult social care / Any coordinated context) and the four governance principles (tailored not total, relationships not job titles, lawful basis on every access, logged and monitored).
- Speaker notes: This slide does double duty — transferability *and* the IG pitch. Don't rush it; IG leads in the audience will be listening hardest here.

**4. Screenshot: sign-in** (`scene-04-login`)
- Headline: "Built for real identity, not a parent portal login"
- Body: NHS Login / Gov.uk / Microsoft SSO shown; "Your information is safe" panel — encrypted, role-based, logged.
- Speaker notes: Brief — this is a connective slide, not a destination.

**5. Screenshot: service-user home (Priya)** (`scene-05-dashboard-priya`)
- Headline: "What a family sees: one coordinated view"
- Body: Journey stepper, needs attention, upcoming appointments, people involved — annotate 3–4 of these regions with short callout labels pointing at the screenshot.
- Speaker notes: Name the persona — "Priya, Aanya's mother." Keep it concrete and human.

**6. Screenshots: journey timeline contrast** (`scene-06a-journey-priya` + `scene-06b-journey-carla-safeguarding`) — **one slide, two images side by side**
- Headline: "Access follows the relationship, not the job title"
- Body: Left image (Priya): no Safeguarding category. Right image (Carla, social worker): Safeguarding category and event visible. Annotate the difference directly with an arrow/highlight.
- Speaker notes: This is the single most important *mechanism* slide in the deck — slow down here. Same case, same platform, two different relationships, two different views, by design.

**7. Screenshot: permissions matrix** (`scene-07-permissions`)
- Headline: "The family is in control"
- Body: Rows = professionals, columns = categories, each cell a live toggle; lawful basis shown per professional.
- Speaker notes: Mention it takes effect immediately, everywhere, and nothing is deleted — access is withdrawn, not destroyed.

**8. Screenshots: hosted meetings** (`scene-08a-meeting-prejoin`, `scene-08b-meeting-live`, `scene-08c-meeting-results`) — **one slide or a 3-step mini-sequence**
- Headline: "Meetings, hosted and summarised automatically"
- Body, per image: (a) consent gate before recording, (b) live recording with captions, (c) AI summary, decisions and extracted coordination actions, ready to save.
- Speaker notes: This is the "all-in-one" payoff — say explicitly that the actions get created automatically and land on the shared list, no one re-types the meeting afterwards.

**9. Screenshot: messaging relay** (`scene-09-messages-routing`)
- Headline: "Message a clinician, reach the system they actually use"
- Body: Highlight the "Routed to Mersey Care · Rio" and "Received via Mersey Care · Rio" labels.
- Speaker notes: No new inbox for professionals — OneView is the relay, not a parallel messaging product.

**10. Screenshot: provider dashboard (Sean)** (`scene-10-provider-dashboard`)
- Headline: "One coordination view per professional, across every agency they touch"
- Body: Stat cards, coordination actions table, caseload-by-status chart.
- Speaker notes: Reiterate: these are coordination actions, not case notes — the underlying record stays in the owning service's system.

**11. Screenshots: governance overview + audit log** (`scene-11a-admin-overview`, `scene-11b-audit-log`) — **one slide, two images**
- Headline: "Every access, logged and explainable"
- Body: Point out that the access entries visible in the feed are the *exact actions just demonstrated* earlier in the deck (the message, the record view) — this is live, not staged.
- Speaker notes: This is the slide that gets a DPO or Caldicott Guardian comfortable. Don't skip the lawful-basis column in the audit table.

**12. Screenshot: Grace's dashboard (Margaret)** (`scene-12-dashboard-grace-margaret`)
- Headline: "Same layer, completely different case"
- Body: Put this side-by-side with slide 5 (Priya) if the layout allows — same component structure, entirely different journey stages, team and organisations (hospital discharge vs. SEND).
- Speaker notes: This is the proof of the opening claim. Land it explicitly: "SEND was where we started, not what this is."

**13. Closing slide** (`scene-13-landing-close`, used small/secondary)
- Headline: "OneView — a coordination layer, built once, reusable everywhere"
- Body: Contact/CTA placeholder; note "prototype — no real data is stored."

### Style direction (OneView's actual design tokens — match these)

```
Brand navy (headings/dark surfaces):  #0f2748 → #16335a → #1e4178
Accent blue (primary actions/links):  #2563eb
App background:                        #f1f5f9
Card surface:                          #ffffff
Body text:                             #0f172a
Muted text:                            #64748b
Status:  ok #16a34a · warn #b45309 · danger #dc2626 · info #2563eb
Category accents: education #2563eb · health #16a34a · social care #9333ea ·
                   safeguarding #dc2626 · housing #ea580c · admin #64748b
Headings: serif (Georgia / Times New Roman) for display headings
Body: system sans-serif stack
Cards: rounded-xl (~12px), subtle 1px border, very light shadow
```

Keep slide backgrounds mostly light (`#f1f5f9` / white), use the navy for
section/title slides and for slide headlines, and let the screenshots —
which already carry the product's UI styling — do most of the visual work.
Don't add gradients, stock photography, or icons that don't appear in the
product itself.

### Output constraints

- Single HTML file, inline `<style>`, no build step, no external fonts/CDNs
  (system font stack only, to match the product's own offline-resilient setup).
- 16:9 slides, one `<section>` per slide, basic prev/next controls plus
  arrow-key navigation.
- Each screenshot should be treated as a real image asset referenced by the
  filenames given above (`scene-01-landing-hero.png` etc.) — assume they sit
  in the same folder as the HTML file.
- Target **14 slides total** (title + 12 content + close), ~60–90 seconds of
  spoken content per slide if presented live.

---

## Screenshot reference (attach these, in this order)

1. `scene-01-landing-hero` — Landing page hero
2. `scene-02-two-worlds` — "Two worlds, one shared layer" section
3. `scene-03-domains-governance` — "One layer, many contexts" + governance principles
4. `scene-04-login` — Sign-in page
5. `scene-05-dashboard-priya` — Priya's (parent) dashboard home
6. `scene-06a-journey-priya` — Priya's journey timeline (no Safeguarding)
7. `scene-06b-journey-carla-safeguarding` — Carla's (social worker) view of the same case, with Safeguarding visible
8. `scene-07-permissions` — Permission matrix
9. `scene-08a-meeting-prejoin` — Meeting consent/pre-join screen
10. `scene-08b-meeting-live` — Live meeting (recording, timer, captions)
11. `scene-08c-meeting-results` — AI summary + extracted actions
12. `scene-09-messages-routing` — Messaging relay (routed / received via Rio)
13. `scene-10-provider-dashboard` — Sean's provider coordination dashboard
14. `scene-11a-admin-overview` — Governance overview dashboard
15. `scene-11b-audit-log` — Full audit log table
16. `scene-12-dashboard-grace-margaret` — Grace's dashboard (Margaret/adult social care case)
17. `scene-13-landing-close` — Landing page (closing bookend)

*(17 images for 13 narrative beats — scenes 6, 8 and 11 each use 2–3 images on one slide, as noted above.)*

This full set of screenshots is available in this conversation immediately
above the point this file was written — save them out and attach them when
you run the prompt.
