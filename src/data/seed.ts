import type {
  SourceSystem,
  ServiceUser,
  Person,
  OneViewEvent,
  ConsentRule,
  Notification,
} from '@/types'

// ---------------------------------------------------------------------------
// Source Systems
// ---------------------------------------------------------------------------
export const sourceSystems: SourceSystem[] = [
  {
    id: 'liquidlogic',
    name: 'Liquidlogic',
    org: 'St Helens Council',
    kind: 'Case Management',
  },
  {
    id: 'rio',
    name: 'Rio',
    org: 'Mersey Care NHS Foundation Trust',
    kind: 'Mental Health EPR',
  },
  {
    id: 'schoolMis',
    name: 'School MIS',
    org: 'St Helens SEND School',
    kind: 'Education Management',
  },
  {
    id: 'alderHey',
    name: 'Alder Hey PAS',
    org: 'Alder Hey Children\'s NHS Foundation Trust',
    kind: 'Patient Administration',
  },
  {
    id: 'graphnet',
    name: 'Graphnet / CIPHA',
    org: 'Shared Care Record · Graphnet / CIPHA',
    kind: 'Shared Care Record',
  },
]

export const sourceSystemMap: Record<string, SourceSystem> = Object.fromEntries(
  sourceSystems.map((s) => [s.id, s])
)

// ---------------------------------------------------------------------------
// Service Users
// ---------------------------------------------------------------------------
export const serviceUsers: ServiceUser[] = [
  {
    id: 'aanya',
    name: 'Aanya Sharma',
    age: 8,
    summary: 'Aanya is an 8-year-old girl with a diagnosis of autism spectrum disorder. She currently holds an Education, Health and Care Plan (EHCP) which is under review. She attends a specialist SEND school in St Helens and receives occupational therapy and CAMHS support.',
    sendCategory: 'Autism Spectrum Disorder — EHCP in progress',
  },
  {
    id: 'lucas',
    name: 'Lucas Okonkwo',
    age: 11,
    summary: 'Lucas is an 11-year-old boy with ADHD and emerging social communication needs. He is being assessed for an EHCP following a request from his primary school.',
    sendCategory: 'ADHD / Social Communication — EHCP assessment pending',
  },
]

// ---------------------------------------------------------------------------
// People / Personas
// ---------------------------------------------------------------------------
export const people: Person[] = [
  {
    id: 'priya',
    name: 'Priya Sharma',
    role: 'Parent',
    org: 'Parent / Carer',
  },
  {
    id: 'ms_patel',
    name: 'Nisha Patel',
    role: 'SENCO',
    org: 'St Helens SEND School',
  },
  {
    id: 'sw_jones',
    name: 'Carla Jones',
    role: 'SocialWorker',
    org: 'St Helens Council — Children\'s Services',
  },
  {
    id: 'dr_hassan',
    name: 'Dr Yasmin Hassan',
    role: 'CAMHSClinician',
    org: 'Mersey Care NHS Foundation Trust — CAMHS',
  },
  {
    id: 'ot_mills',
    name: 'Rachel Mills',
    role: 'OT',
    org: 'Alder Hey Children\'s NHS Foundation Trust — Therapy Services',
  },
  {
    id: 'cw_byrne',
    name: 'Sean Byrne',
    role: 'Caseworker',
    org: 'St Helens Council — SEND Casework Team',
  },
]

// ---------------------------------------------------------------------------
// Helpers — dates relative to 2026-06-26 (current demo date)
// ---------------------------------------------------------------------------
const demoToday = new Date('2026-06-26T12:00:00.000Z')

function daysAgo(days: number): string {
  const d = new Date(demoToday)
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

// ---------------------------------------------------------------------------
// Seed Events — 8 historical events across all source systems
// ---------------------------------------------------------------------------
export const seedEvents: OneViewEvent[] = [
  // 1. EHC needs assessment started — 6 months ago — Liquidlogic / social_care
  {
    id: 'evt-001',
    type: 'ehc_needs_assessment_started',
    title: 'EHC needs assessment initiated',
    timestamp: daysAgo(182),
    sourceSystemId: 'liquidlogic',
    category: 'social_care',
  },

  // 2. EHCP review scheduled — 5 months ago — School MIS / education
  {
    id: 'evt-002',
    type: 'ehcp_review_scheduled',
    title: 'EHCP annual review meeting scheduled',
    timestamp: daysAgo(152),
    sourceSystemId: 'schoolMis',
    category: 'education',
    payload: {
      date: '2026-03-10',
      time: '10:00',
      location: 'St Helens SEND School — Room 4B',
      isVirtual: false,
      participants: ['Priya Sharma', 'Nisha Patel', 'Sean Byrne'],
    },
  },

  // 3. CAMHS referral accepted — 4 months ago — Rio / health
  {
    id: 'evt-003',
    type: 'camhs_referral_accepted',
    title: 'CAMHS referral accepted',
    timestamp: daysAgo(122),
    sourceSystemId: 'rio',
    category: 'health',
  },

  // 4. Appointment booked — 3 months ago — Alder Hey / health (virtual)
  {
    id: 'evt-004',
    type: 'appointment_booked',
    title: 'OT initial assessment appointment booked',
    timestamp: daysAgo(91),
    sourceSystemId: 'alderHey',
    category: 'health',
    payload: {
      date: '2026-04-15',
      time: '14:30',
      location: 'Alder Hey Children\'s Hospital — Therapy Suite',
      isVirtual: true,
      joinLink: 'https://teams.microsoft.com/l/meetup-join/demo-link-ot-001',
      participants: ['Rachel Mills', 'Priya Sharma', 'Aanya Sharma'],
    },
  },

  // 5. OT report ready — 2 months ago — Alder Hey / health
  {
    id: 'evt-005',
    type: 'ot_report_ready',
    title: 'Occupational therapy assessment report available',
    timestamp: daysAgo(61),
    sourceSystemId: 'alderHey',
    category: 'health',
    payload: {
      title: 'OT Assessment Report — Aanya Sharma',
      docType: 'Clinical Assessment',
      sourceSystem: 'Alder Hey PAS',
      status: 'available',
      sourceLink: 'https://alderhey.nhs.uk/records/demo/ot-report-aanya',
    },
  },

  // 6. EHCP draft available — 1 month ago — Graphnet / admin
  {
    id: 'evt-006',
    type: 'document_available',
    title: 'EHCP draft document shared to shared care record',
    timestamp: daysAgo(30),
    sourceSystemId: 'graphnet',
    category: 'admin',
    payload: {
      title: 'EHCP Draft — Aanya Sharma (2026)',
      docType: 'EHCP Draft',
      sourceSystem: 'Graphnet / CIPHA',
      status: 'available',
      sourceLink: 'https://cipha.nhs.uk/records/demo/ehcp-draft-aanya-2026',
    },
  },

  // 7. Annual review due — 2 weeks ago — School MIS / education
  {
    id: 'evt-007',
    type: 'annual_review_due',
    title: 'Annual EHCP review due — action required',
    timestamp: daysAgo(14),
    sourceSystemId: 'schoolMis',
    category: 'education',
  },

  // 8. Placement confirmed — 1 week ago — Liquidlogic / social_care
  {
    id: 'evt-008',
    type: 'placement_confirmed',
    title: 'Specialist school placement confirmed for September 2026',
    timestamp: daysAgo(7),
    sourceSystemId: 'liquidlogic',
    category: 'social_care',
  },
]

// ---------------------------------------------------------------------------
// Scripted Events — reserved for demo simulator, NOT in initial seed
// ---------------------------------------------------------------------------
export const scriptedEvents: OneViewEvent[] = [
  {
    id: 'script-001',
    type: 'camhs_referral_accepted',
    title: 'CAMHS therapy sessions confirmed',
    timestamp: new Date().toISOString(), // set at fire time
    sourceSystemId: 'rio',
    category: 'health',
  },
  {
    id: 'script-002',
    type: 'ot_report_ready',
    title: 'Updated OT assessment available',
    timestamp: new Date().toISOString(),
    sourceSystemId: 'alderHey',
    category: 'health',
    payload: {
      title: 'Updated OT Assessment — Aanya Sharma',
      docType: 'Clinical Assessment (Updated)',
      sourceSystem: 'Alder Hey PAS',
      status: 'available',
      sourceLink: 'https://alderhey.nhs.uk/records/demo/ot-report-aanya-v2',
    },
  },
  {
    id: 'script-003',
    type: 'annual_review_due',
    title: 'Annual EHCP review reminder',
    timestamp: new Date().toISOString(),
    sourceSystemId: 'schoolMis',
    category: 'education',
  },
]

// ---------------------------------------------------------------------------
// Consent Rules
// SENCO    → education + admin   (NOT health — key demo moment)
// SocialWorker → social_care + admin
// CAMHSClinician → health
// OT       → health + education
// Caseworker → education + social_care + admin
// Parent   → all (derived in canSee — no rule needed)
// ---------------------------------------------------------------------------
export const seedConsentRules: ConsentRule[] = [
  {
    serviceUserId: 'aanya',
    granteeRole: 'SENCO',
    allowedCategories: ['education', 'admin'],
  },
  {
    serviceUserId: 'aanya',
    granteeRole: 'SocialWorker',
    allowedCategories: ['social_care', 'admin'],
  },
  {
    serviceUserId: 'aanya',
    granteeRole: 'CAMHSClinician',
    allowedCategories: ['health'],
  },
  {
    serviceUserId: 'aanya',
    granteeRole: 'OT',
    allowedCategories: ['health', 'education'],
  },
  {
    serviceUserId: 'aanya',
    granteeRole: 'Caseworker',
    allowedCategories: ['education', 'social_care', 'admin'],
  },
]

// ---------------------------------------------------------------------------
// Seed Notifications
// ---------------------------------------------------------------------------
export const seedNotifications: Notification[] = [
  {
    id: 'notif-001',
    eventId: 'evt-007',
    message: 'Annual EHCP review is due — please take action.',
    timestamp: daysAgo(14),
    read: false,
  },
  {
    id: 'notif-002',
    eventId: 'evt-008',
    message: 'Specialist school placement confirmed for September 2026.',
    timestamp: daysAgo(7),
    read: false,
  },
  {
    id: 'notif-003',
    eventId: 'evt-006',
    message: 'EHCP draft document has been shared to the shared care record.',
    timestamp: daysAgo(30),
    read: true,
  },
]
