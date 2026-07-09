# OneView — Site Walkthrough Script

A scene-by-scene script for recording a ~6-minute walkthrough video of OneView.
Read the **Say** column aloud (or use it as a voiceover script) while performing
the **Do** column on the live site. Each scene names the exact persona/case to
be in, so the recording stays consistent.

> Note on scope: I can't render an actual video or animation file — there's no
> tool available to me that produces binary media. This script is the practical
> substitute: follow it while screen-recording the deployed app (or read it
> aloud over screenshots) and you'll have a complete, accurate walkthrough.
> The in-app **page tours** built alongside this script (see `src/lib/tours.ts`)
> cover the same ground interactively and can themselves be screen-recorded
> for a quick, low-effort version of this video — see Scene 9.

---

## Before you record

- **Browser**: a clean window at **1440×900** (or similar desktop size), no extensions
  visible in the corner (disable ad-blockers / note-taking extensions — they show
  as floating icons in screenshots).
- **Reset state**: open the deployed URL, then run `localStorage.clear()` in
  devtools (or open an incognito window) so the page tours and "seen" state
  start fresh — first-visit auto-tours make good incidental footage but you
  don't want one popping up mid-scene unintentionally.
- **Reset the demo data**: in the Demo Simulator panel (visible on the service-user
  Home page), click **Reset demo** once, so the meeting/messaging scenes below
  produce their first-time outcome (unfired events, no meeting outcomes yet).
- **Zoom**: keep browser zoom at 100% — text sizing is tuned for it.
- **Audio**: record narration as a separate pass if it's easier to get timing right;
  the **Say** lines are written to roughly match the pacing of the **Do** actions.

---

## Cast (personas used in this walkthrough)

| Persona | Role | Why we use them |
|---|---|---|
| **Priya Sharma** | Parent (service-user side) | Demonstrates the family/citizen experience and the relationship-based visibility rule |
| **Dr Yasmin Hassan** (referenced, not switched to) | CAMHS Clinician | The other end of the messaging relay |
| **Carla Jones** | Social Worker | Shows a *different* slice of the same case — including the safeguarding item Priya can't see |
| **Sean Byrne** | SEND Case Officer (provider side) | Demonstrates the professional coordination view |
| **Admin User** | Platform Admin | Demonstrates governance and the audit trail |
| **Margaret Okafor** (case, not a persona) | — | Proves the platform is transferable beyond SEND |

---

## Scene 1 — Cold open (0:00–0:20)

**Do:** Open the landing page (`/`) fresh, fully scrolled to top.

**Say:**
> "This is OneView — not another case management system, and not a parent portal. It's a coordination layer: one shared, governed picture of a person's support, built from the systems professionals already use."

---

## Scene 2 — The pitch (0:20–0:55)

**Do:** Slowly scroll past the hero, the four feature cards, and the "Two worlds, one shared layer" section. Pause briefly on the service-user / service-provider split.

**Say:**
> "Two worlds meet here. On one side, the person being supported, and the family, carers and advocates acting for them. On the other, every organisation involved — local authority, NHS, school, housing, police, the voluntary sector. Nothing here replaces their existing systems. OneView coordinates between them."

---

## Scene 3 — Transferable, not just SEND (0:55–1:15)

**Do:** Scroll to "One layer, many contexts" (the three domain cards).

**Say:**
> "And it isn't built for one use case. This demo runs two completely different scenarios on the exact same platform — a child's SEND journey, and an adult's hospital discharge — to prove the layer itself is what's reusable, not the workflow."

---

## Scene 4 — Signing in as a parent (1:15–1:40)

**Do:** Click **"I need support"**. On `/login`, briefly highlight the safety panel, then submit the form (or click an SSO button) to land on `/dashboard` as **Priya Sharma**.

**Say:**
> "I'll sign in as Priya, a parent. In production this would be NHS Login or Gov.uk One Login — for this prototype, signing in drops you straight into your account."

---

## Scene 5 — The service-user home (1:40–2:15)

**Do:** On `/dashboard`, point out the journey stepper, "Needs attention", upcoming appointments, and people involved, top to bottom.

**Say:**
> "This is Priya's home. A journey stepper shows where Aanya's EHCP process stands. Anything needing attention surfaces first. Below that, upcoming appointments and the team currently involved — all filtered to exactly what Priya is entitled to see."

---

## Scene 6 — Relationship-based visibility (2:15–2:55)

**Do:** Navigate to `/dashboard/journey`. Show the timeline and category filters (no "Safeguarding" tab visible). Then **switch persona** (sidebar/header dropdown) to **Carla Jones**, land on her provider caseload, open **Aanya Sharma's record**, and show the **Safeguarding** category now present.

**Say:**
> "Here's the core idea: access isn't decided by job title, it's decided by the *relationship* to the person, plus the lawful basis for that relationship. Priya, as Aanya's mother on Consent, never sees safeguarding-sensitivity items. Switch to Carla, the social worker — her relationship is Safeguarding — and a category appears that simply isn't there for Priya. Same case, same platform, two different windows onto it. And opening this record is itself logged."

---

## Scene 7 — Consent in the family's hands (2:55–3:20)

**Do:** Switch back to **Priya**, go to `/dashboard/permissions`. Toggle one category off and back on for a professional.

**Say:**
> "Priya can see, in plain terms, exactly who can see what about Aanya — and change it herself. Toggle a category off, and that professional's visibility changes immediately, everywhere. Nothing is deleted; access is just withdrawn until she re-grants it."

---

## Scene 8 — Meetings, hosted and summarised (3:20–4:20)

**Do:** Go to `/dashboard/appointments`. Click **Join meeting** on the SEN Review Meeting. Walk through: consent checkbox → Join → show the recording indicator, timer and live captions for a few seconds → **End meeting & generate notes** → let the AI-processing animation play out → show the summary, decisions and extracted actions → **Save**.

**Say:**
> "This is the part that makes OneView genuinely all-in-one. Click Join, and the meeting itself happens inside OneView — recorded, with consent, purely to generate shared notes. When it ends, AI turns the discussion into a plain-language summary, the key decisions, and a set of coordination actions with an owner and a priority each. Save it, and the summary lands on the timeline, the actions appear on everyone's action list — and the whole thing is logged."

**Do (quick cutaway):** Navigate to `/dashboard/journey` and show the new "Meeting summary" event at the top; then `/dashboard/tasks` showing the new actions.

---

## Scene 9 — Messaging that routes through real systems (4:20–4:55)

**Do:** Go to `/dashboard/messages`. Open the **CAMHS — therapy & sleep** thread (it auto-opens, most recent first). Send a message. Point out the **"Routed to Mersey Care · Rio"** label, then wait ~3 seconds for the simulated reply and point out **"Received via Mersey Care · Rio"**.

**Say:**
> "Message a clinician here, and it doesn't sit in a OneView inbox — it's delivered into the system they actually work in, in this case Rio. Their reply routes back through OneView automatically. One conversation, two systems, no new inbox for anyone to check."

---

## Scene 10 — The professional's coordination view (4:55–5:30)

**Do:** Switch persona to **Sean Byrne**, landing on `/provider`. Point out the stat cards, the coordination-actions table, and click **New action** to log one live.

**Say:**
> "On the provider side, Sean sees a cross-agency view of his work — caseload, what's due, what's overdue. These are coordination actions, not case notes: who owes what, across agencies. OneView surfaces and connects; the underlying record always stays in each service's own system."

---

## Scene 11 — Governance, made visible (5:30–6:05)

**Do:** Switch to **Admin User**, landing on `/admin`. Show the stat cards, the access-by-purpose donut, and scroll to recent access activity — pointing out the meeting and message-reply entries that were just generated. Click through to `/admin/audit` briefly.

**Say:**
> "And everything we just did — the record Carla opened, the meeting that was recorded, the reply that came back from Rio — all of it is here, in an immutable audit trail, with the lawful basis for every single access. This is what lets an information governance lead sign off on OneView as infrastructure, not just another app."

---

## Scene 12 — One layer, a completely different case (6:05–6:30)

**Do:** Use the case switcher to flip from **Aanya Sharma** to **Margaret Okafor**. Show the dashboard re-populating with a hospital-discharge journey — different organisations, different categories, same components.

**Say:**
> "Switch the case, and watch what doesn't change: the same timeline, the same permission model, the same meeting and messaging tools — just pointed at a 78-year-old's hospital discharge instead of a child's EHCP. That's the proof. OneView isn't a SEND product with extra steps. It's a coordination layer, and SEND was simply where we started."

---

## Scene 13 — Close (6:30–6:50)

**Do:** Return to the landing page.

**Say:**
> "OneView: a secure, governed coordination layer — for the people supporting someone, and the person themselves — built once, and reusable everywhere coordinated care happens."

*(End card: logo, URL, "Built as a clickable prototype — no real data is stored.")*

---

## Appendix — Using the in-app tours as a shortcut

Every page now has a guided tour (dim overlay, spotlighted element, Back/Next,
dismissible, restartable from the **"?"** icon in the header or **"Take the
tour"** in the side menu). If a full narrated recording isn't needed, simply
screen-recording someone clicking through 4–5 of these page tours back-to-back
— Home, Journey, Appointments, Provider Dashboard, Governance Overview —
produces a serviceable short walkthrough with built-in narration text already
on screen, with far less production effort than the full script above.
