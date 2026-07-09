// ---------------------------------------------------------------------------
// Per-page guided tours. Keyed by exact pathname. Each step targets an
// element via a `data-tour="<id>"` attribute somewhere on the page.
//
// Scope note: the two dynamic drill-in routes (/dashboard/journey/[id] and
// /provider/caseload/[id]) are reached via a card click, not direct nav, and
// are intentionally left without a dedicated tour — every page reachable from
// the sidebar/nav has one.
// ---------------------------------------------------------------------------

export interface TourStep {
  target: string
  title: string
  body: string
}

export const TOURS: Record<string, TourStep[]> = {
  '/': [
    { target: 'landing-hero', title: 'Welcome to OneView', body: 'This is the public landing page — the pitch for OneView as a coordination layer, not another portal. Two clear paths in: get support, or sign in as a professional.' },
    { target: 'landing-cta', title: 'Two ways in', body: 'Citizens, parents and carers start with "I need support". Professionals and organisations use "I work in services". Both lead to the same shared layer — just different views of it.' },
    { target: 'landing-two-worlds', title: 'Two worlds, one layer', body: 'Service users and service providers sit on either side of OneView. Nothing here replaces existing systems — it coordinates between them.' },
    { target: 'landing-journeys', title: 'Everyone has a journey', body: 'Scroll down to see how different participants — a parent, a clinician, a social worker, an admin — each move through the platform with only the access their role and relationship allow.' },
  ],
  '/login': [
    { target: 'login-form', title: 'Signing in', body: 'This is a prototype, so signing in drops you straight into a default persona. In the real product this would use NHS Login, Gov.uk One Login, or your organisation’s SSO.' },
    { target: 'login-safety', title: 'Your information is protected', body: 'Every access is encrypted, role-based, and logged — this panel explains what that means before anyone signs in.' },
  ],

  // --- Service-user side ---
  '/dashboard': [
    { target: 'home-welcome', title: 'Your home', body: 'This is your personal coordination view — a welcome banner showing whose journey you’re following and your relationship to them.' },
    { target: 'home-journey', title: 'Journey overview', body: 'A quick-glance stepper shows where things stand — Referral, Assessment, Plan, Support, Review. Click "View timeline" for the full picture.' },
    { target: 'home-attention', title: 'Needs attention', body: 'Anything due or overdue surfaces here first, so nothing important gets missed.' },
    { target: 'home-appointments', title: 'Upcoming appointments', body: 'Appointments you’re permitted to see, in date order. Some can be joined as a OneView meeting — more on that on the Appointments page.' },
    { target: 'home-people', title: 'People involved', body: 'Everyone with a relationship to this case, and their role — the team coordinating support.' },
    { target: 'home-simulator', title: 'Live demo simulator', body: 'This panel exists for the demo only — it lets you fire live events from source systems, so you can watch the timeline update in real time.' },
  ],
  '/dashboard/journey': [
    { target: 'journey-intro', title: 'My journey', body: 'A single, consent-filtered timeline. Every event is labelled with the system it came from — OneView never invents or stores the underlying record.' },
    { target: 'journey-filters', title: 'Filter by category', body: 'Switch between Education, Health, Social Care and more. Only categories with visible events for you are shown.' },
    { target: 'journey-events', title: 'The timeline', body: 'Each card opens for more detail — including appointment information, documents, or an AI-generated meeting summary.' },
  ],
  '/dashboard/permissions': [
    { target: 'permissions-intro', title: 'My permissions', body: 'This page shows exactly who can see what about your case, and why.' },
    { target: 'permissions-banner', title: 'You’re in control', body: 'As a parent or carer, you can grant or revoke a professional’s access to a category at any time — it takes effect immediately, everywhere.' },
    { target: 'permission-matrix', title: 'The permission matrix', body: 'Rows are people; columns are categories. Each professional’s lawful basis for access — Consent, Direct Care, Safeguarding — is shown alongside.' },
  ],
  '/dashboard/tasks': [
    { target: 'page-intro', title: 'Actions', body: 'Coordination actions across this case — who’s doing what, and by when. These are cross-agency to-dos, not clinical records. Actions created from a meeting summary appear here automatically.' },
  ],
  '/dashboard/messages': [
    { target: 'messages-intro', title: 'Messages', body: 'Secure conversations with the team. Threads are collapsible and sorted by most recent activity.' },
    { target: 'messages-thread', title: 'How routing works', body: 'Message a professional and OneView delivers it into the system they actually use — like Rio or Liquidlogic. Replies route back here automatically.' },
  ],
  '/dashboard/appointments': [
    { target: 'appointments-intro', title: 'Appointments', body: 'Every appointment you’re permitted to see, with its source system.' },
    { target: 'appointments-meeting-btn', title: 'Join meetings here', body: 'For appointments hosted in OneView, click Join to enter the meeting room. OneView records it, then AI turns the discussion into a summary and actions automatically.' },
  ],
  '/dashboard/documents': [
    { target: 'page-intro', title: 'Documents', body: 'OneView shows that a document exists and links back to it — it never stores or copies the file itself. Each entry shows its type, source organisation, and whether it’s available yet.' },
  ],
  '/dashboard/people': [
    { target: 'page-intro', title: 'People involved', body: 'Everyone connected to this case, their relationship type, and the lawful basis for their involvement.' },
  ],
  '/dashboard/help': [
    { target: 'page-intro', title: 'Notifications & help', body: 'Catch up on recent activity and find quick answers to common questions. Unread notifications are highlighted — click one to mark it read.' },
  ],

  // --- Service-provider side ---
  '/provider': [
    { target: 'provider-welcome', title: 'Your coordination view', body: 'A cross-agency view of your work — OneView surfaces and connects information; the underlying records stay in each service’s own system.' },
    { target: 'provider-stats', title: 'At a glance', body: 'Caseload size, what’s due, what’s overdue, and recent activity — your week in five numbers.' },
    { target: 'provider-actions', title: 'Coordination actions', body: 'Cross-agency actions across your caseload — who owes what. Use "New action" to log one.' },
    { target: 'provider-new-action', title: 'Log a coordination action', body: 'Quickly capture who needs to do what, with a priority and category — it’s added straight to the shared list and logged.' },
    { target: 'provider-caseload-chart', title: 'Caseload by status', body: 'A breakdown of where every task across your caseload currently stands.' },
  ],
  '/provider/caseload': [
    { target: 'page-intro', title: 'My caseload', body: 'Everyone you support, and your relationship to each. Click "Open record" to see the slice of someone’s timeline your relationship permits — opening it is itself logged for governance.' },
  ],
  '/provider/tasks': [
    { target: 'page-intro', title: 'Coordination actions', body: 'Every cross-agency action across your caseload in one table. Use "Complete" to close one out once it’s done — it’s reflected everywhere instantly.' },
  ],
  '/provider/messages': [
    { target: 'page-intro', title: 'Messages', body: 'Multi-agency conversations you’re part of, across every case in your caseload — each thread shows which case it relates to and the system messages route through.' },
  ],
  '/provider/calendar': [
    { target: 'page-intro', title: 'Calendar', body: 'Every appointment across your caseload, grouped by date. Join hosted meetings directly from here, or open the summary once one’s been recorded.' },
  ],
  '/provider/people': [
    { target: 'page-intro', title: 'People', body: 'The full multi-agency team around each person in your caseload — who else is involved, and which organisation they’re from.' },
  ],
  '/provider/reports': [
    { target: 'page-intro', title: 'Reports', body: 'A snapshot of activity across everyone you support — see where effort is concentrated across education, health, social care and more.' },
  ],
  '/provider/resources': [
    { target: 'page-intro', title: 'Resources', body: 'Guidance and reference material for working in OneView — from information-sharing agreements to safeguarding escalation routes.' },
  ],

  // --- Admin / governance ---
  '/admin': [
    { target: 'admin-welcome', title: 'Governance overview', body: 'Every access to a record across the platform is logged and monitored — this is where that’s made visible.' },
    { target: 'admin-stats', title: 'Key numbers', body: 'Users, organisations, data accesses and active consents, at a glance.' },
    { target: 'admin-purpose', title: 'Access by purpose', body: 'See how often each lawful basis — Consent, Direct Care, Safeguarding — is being relied on.' },
    { target: 'admin-activity', title: 'Recent access activity', body: 'A live feed of who accessed what, and why. Firing a demo event or completing a meeting adds an entry here instantly.' },
    { target: 'admin-orgs', title: 'Access by organisation', body: 'Which organisations are most active on the platform.' },
  ],
  '/admin/audit': [
    { target: 'page-intro', title: 'Audit log', body: 'The immutable record behind the governance numbers — every access and change, in order, permanent.' },
  ],
  '/admin/consent': [
    { target: 'consent-intro', title: 'Consent management', body: 'Govern which categories each relationship can access, for any case.' },
    { target: 'consent-case-selector', title: 'Switch case', body: 'Choose which person’s consent settings you’re viewing — the same control works across both demo cases.' },
    { target: 'permission-matrix', title: 'Grant or revoke access', body: 'Toggle a cell to change what a relationship can see — it’s enforced immediately, and logged.' },
  ],
  '/admin/relationships': [
    { target: 'page-intro', title: 'Relationships', body: 'Access flows from a relationship to the person at the centre — never from a job title alone. Each row shows who’s connected to whom, their lawful basis, and what they can see.' },
  ],
  '/admin/users': [
    { target: 'page-intro', title: 'Users', body: 'Everyone with an account on the platform, across both the service-user and provider sides, with their role and organisation.' },
  ],
  '/admin/organisations': [
    { target: 'page-intro', title: 'Organisations', body: 'Every organisation connected to OneView — health, care, education, housing, police and the voluntary sector.' },
  ],
  '/admin/roles': [
    { target: 'page-intro', title: 'Roles & permissions', body: 'Default access patterns by role. Actual access always resolves through the individual relationship to the person, not the role alone.' },
  ],
  '/admin/data-access': [
    { target: 'page-intro', title: 'Data access', body: 'Where access is concentrated, across subjects and action types. For the full chronological record, head to the audit log.' },
  ],
  '/admin/reports': [
    { target: 'page-intro', title: 'Reports', body: 'Governance and assurance reporting across the whole platform — including a breakdown of relationships by lawful basis.' },
  ],
  '/admin/settings': [
    { target: 'page-intro', title: 'Settings', body: 'Tenant-level configuration and governance defaults — data residency, audit retention, review cadence and single sign-on.' },
  ],
}
