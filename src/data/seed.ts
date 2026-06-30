import type {
  Organisation,
  ServiceUser,
  Participant,
  Relationship,
  TimelineEvent,
  Task,
  DocumentRecord,
  Appointment,
  MessageThread,
  Notification,
  AccessLogEntry,
  JourneyStage,
} from '@/types'

// ---------------------------------------------------------------------------
// Demo clock — everything is relative to this fixed "today" so the prototype
// reads consistently regardless of the real date.
// ---------------------------------------------------------------------------
const demoToday = new Date('2026-06-26T12:00:00.000Z')

export function daysAgo(days: number): string {
  const d = new Date(demoToday)
  d.setDate(d.getDate() - days)
  return d.toISOString()
}
function daysAhead(days: number): string {
  return daysAgo(-days)
}

// ---------------------------------------------------------------------------
// Organisations
// ---------------------------------------------------------------------------
export const organisations: Organisation[] = [
  { id: 'la_sthelens', name: 'St Helens Council', shortName: 'St Helens Council', type: 'LocalAuthority' },
  { id: 'nhs_merseycare', name: 'Mersey Care NHS Foundation Trust', shortName: 'Mersey Care', type: 'NHS' },
  { id: 'school_send', name: 'Greenbank SEND School', shortName: 'Greenbank School', type: 'School' },
  { id: 'nhs_alderhey', name: "Alder Hey Children's NHS Foundation Trust", shortName: 'Alder Hey', type: 'NHS' },
  { id: 'scr_graphnet', name: 'Shared Care Record (Graphnet / CIPHA)', shortName: 'Graphnet / CIPHA', type: 'NHS' },
  // Domain 2 — adult social care / hospital discharge
  { id: 'nhs_acute', name: 'Whiston Hospital (Mersey & West Lancs)', shortName: 'Whiston Hospital', type: 'NHS' },
  { id: 'nhs_community', name: 'Community Health & District Nursing', shortName: 'Community Health', type: 'NHS' },
  { id: 'housing_helena', name: 'Torus Housing', shortName: 'Torus Housing', type: 'Housing' },
  { id: 'vcse_ageuk', name: 'Age UK Mid Mersey', shortName: 'Age UK', type: 'VCSE' },
  { id: 'police_merseyside', name: 'Merseyside Police', shortName: 'Merseyside Police', type: 'Police' },
]

export const organisationMap: Record<string, Organisation> = Object.fromEntries(
  organisations.map((o) => [o.id, o]),
)

// ---------------------------------------------------------------------------
// Service users — two domains
// ---------------------------------------------------------------------------
export const serviceUsers: ServiceUser[] = [
  {
    id: 'aanya',
    name: 'Aanya Sharma',
    age: 8,
    domain: 'SEND',
    contextLabel: 'Autism Spectrum Disorder — EHCP in progress',
    status: 'EHCP Active',
    summary:
      'Aanya is an 8-year-old girl with a diagnosis of autism spectrum disorder. She holds an Education, Health and Care Plan (EHCP) under review, attends a specialist SEND school and receives occupational therapy and CAMHS support.',
    avatarColor: '#2563eb',
  },
  {
    id: 'margaret',
    name: 'Margaret Okafor',
    age: 78,
    domain: 'AdultSocialCare',
    contextLabel: 'Post-stroke hospital discharge — care & home adaptations',
    status: 'Discharge planning',
    summary:
      'Margaret is a 78-year-old woman recovering from a stroke. Her discharge from hospital is being coordinated across acute and community health, adult social care, housing adaptations and a VCSE befriending service, with her daughter acting as carer and advocate.',
    avatarColor: '#0d9488',
  },
]
export const serviceUserMap: Record<string, ServiceUser> = Object.fromEntries(
  serviceUsers.map((s) => [s.id, s]),
)

// ---------------------------------------------------------------------------
// Participants (people who sign in)
// ---------------------------------------------------------------------------
export const participants: Participant[] = [
  // --- Service-user side ---
  { id: 'priya', name: 'Priya Sharma', side: 'service_user', baseRole: 'Parent', avatarColor: '#7c3aed' },
  { id: 'grace', name: 'Grace Okafor', side: 'service_user', baseRole: 'Carer / Advocate', avatarColor: '#db2777' },

  // --- Service-provider side: SEND case ---
  { id: 'nisha', name: 'Nisha Patel', side: 'service_provider', baseRole: 'SENCO', organisationId: 'school_send', avatarColor: '#2563eb' },
  { id: 'carla', name: 'Carla Jones', side: 'service_provider', baseRole: 'Social Worker', organisationId: 'la_sthelens', avatarColor: '#9333ea' },
  { id: 'yasmin', name: 'Dr Yasmin Hassan', side: 'service_provider', baseRole: 'CAMHS Clinician', organisationId: 'nhs_merseycare', avatarColor: '#16a34a' },
  { id: 'rachel', name: 'Rachel Mills', side: 'service_provider', baseRole: 'Occupational Therapist', organisationId: 'nhs_alderhey', avatarColor: '#0891b2' },
  { id: 'sean', name: 'Sean Byrne', side: 'service_provider', baseRole: 'SEND Case Officer', organisationId: 'la_sthelens', avatarColor: '#ca8a04' },

  // --- Service-provider side: adult case ---
  { id: 'david', name: 'David Hughes', side: 'service_provider', baseRole: 'Discharge Coordinator', organisationId: 'nhs_acute', avatarColor: '#dc2626' },
  { id: 'amara', name: 'Amara Singh', side: 'service_provider', baseRole: 'Adult Social Worker', organisationId: 'la_sthelens', avatarColor: '#9333ea' },
  { id: 'tom', name: 'Tom Reilly', side: 'service_provider', baseRole: 'Community OT', organisationId: 'nhs_community', avatarColor: '#0891b2' },
  { id: 'fiona', name: 'Fiona Walsh', side: 'service_provider', baseRole: 'Housing Officer', organisationId: 'housing_helena', avatarColor: '#ea580c' },

  // --- Platform admin ---
  { id: 'admin', name: 'Admin User', side: 'service_provider', baseRole: 'Platform Admin', organisationId: 'la_sthelens', avatarColor: '#16335a' },
]
export const participantMap: Record<string, Participant> = Object.fromEntries(
  participants.map((p) => [p.id, p]),
)

// ---------------------------------------------------------------------------
// Relationships — participant ↔ service user, with the permissions that flow
// from that relationship. THIS is what governs visibility, not the user type.
// ---------------------------------------------------------------------------
export const seedRelationships: Relationship[] = [
  // ===== Aanya (SEND) =====
  {
    id: 'rel-aanya-priya',
    participantId: 'priya',
    serviceUserId: 'aanya',
    relationshipType: 'Mother (parental responsibility)',
    lawfulBasis: 'Consent',
    allowedCategories: ['education', 'health', 'social_care', 'admin'],
    allowedSensitivities: ['standard', 'clinical'],
    allowedActions: ['upload_evidence', 'message', 'view_appointments'],
  },
  {
    id: 'rel-aanya-nisha',
    participantId: 'nisha',
    serviceUserId: 'aanya',
    relationshipType: 'Education professional (SENCO)',
    lawfulBasis: 'Statutory Requirement',
    allowedCategories: ['education', 'admin'],
    allowedSensitivities: ['standard'],
    allowedActions: ['upload_reports', 'message', 'coordinate_meetings'],
  },
  {
    id: 'rel-aanya-carla',
    participantId: 'carla',
    serviceUserId: 'aanya',
    relationshipType: 'Social worker',
    lawfulBasis: 'Safeguarding',
    allowedCategories: ['social_care', 'safeguarding', 'admin'],
    allowedSensitivities: ['standard', 'safeguarding'],
    allowedActions: ['create_assessment', 'assign_tasks', 'message', 'coordinate_meetings'],
  },
  {
    id: 'rel-aanya-yasmin',
    participantId: 'yasmin',
    serviceUserId: 'aanya',
    relationshipType: 'Health professional (CAMHS)',
    lawfulBasis: 'Direct Care',
    allowedCategories: ['health'],
    allowedSensitivities: ['standard', 'clinical'],
    allowedActions: ['upload_reports', 'update_appointments', 'message'],
  },
  {
    id: 'rel-aanya-rachel',
    participantId: 'rachel',
    serviceUserId: 'aanya',
    relationshipType: 'Health professional (OT)',
    lawfulBasis: 'Direct Care',
    allowedCategories: ['health', 'education'],
    allowedSensitivities: ['standard', 'clinical'],
    allowedActions: ['upload_reports', 'update_appointments', 'message'],
  },
  {
    id: 'rel-aanya-sean',
    participantId: 'sean',
    serviceUserId: 'aanya',
    relationshipType: 'SEND case officer',
    lawfulBasis: 'Statutory Requirement',
    allowedCategories: ['education', 'social_care', 'admin'],
    allowedSensitivities: ['standard'],
    allowedActions: ['create_assessment', 'assign_tasks', 'coordinate_meetings', 'message'],
  },

  // ===== Margaret (adult social care) =====
  {
    id: 'rel-margaret-grace',
    participantId: 'grace',
    serviceUserId: 'margaret',
    relationshipType: 'Daughter / Advocate (LPA — health & welfare)',
    lawfulBasis: 'Consent',
    allowedCategories: ['health', 'social_care', 'housing', 'admin'],
    allowedSensitivities: ['standard', 'clinical'],
    allowedActions: ['upload_evidence', 'message', 'view_appointments'],
  },
  {
    id: 'rel-margaret-david',
    participantId: 'david',
    serviceUserId: 'margaret',
    relationshipType: 'Discharge coordinator',
    lawfulBasis: 'Direct Care',
    allowedCategories: ['health', 'social_care', 'admin'],
    allowedSensitivities: ['standard', 'clinical'],
    allowedActions: ['create_assessment', 'coordinate_meetings', 'update_appointments', 'message'],
  },
  {
    id: 'rel-margaret-amara',
    participantId: 'amara',
    serviceUserId: 'margaret',
    relationshipType: 'Adult social worker',
    lawfulBasis: 'Statutory Requirement',
    allowedCategories: ['social_care', 'housing', 'safeguarding', 'admin'],
    allowedSensitivities: ['standard', 'safeguarding'],
    allowedActions: ['create_assessment', 'assign_tasks', 'coordinate_meetings', 'message'],
  },
  {
    id: 'rel-margaret-tom',
    participantId: 'tom',
    serviceUserId: 'margaret',
    relationshipType: 'Community OT',
    lawfulBasis: 'Direct Care',
    allowedCategories: ['health', 'housing'],
    allowedSensitivities: ['standard', 'clinical'],
    allowedActions: ['upload_reports', 'update_appointments', 'message'],
  },
  {
    id: 'rel-margaret-fiona',
    participantId: 'fiona',
    serviceUserId: 'margaret',
    relationshipType: 'Housing officer',
    lawfulBasis: 'Legal Obligation',
    allowedCategories: ['housing', 'admin'],
    allowedSensitivities: ['standard'],
    allowedActions: ['upload_reports', 'message', 'coordinate_meetings'],
  },
]

// ---------------------------------------------------------------------------
// Timeline events
// ---------------------------------------------------------------------------
export const seedEvents: TimelineEvent[] = [
  // ===== Aanya =====
  {
    id: 'evt-a1', serviceUserId: 'aanya', type: 'referral',
    title: 'EHC needs assessment initiated', timestamp: daysAgo(182),
    sourceOrganisationId: 'la_sthelens', category: 'social_care', sensitivity: 'standard',
  },
  {
    id: 'evt-a2', serviceUserId: 'aanya', type: 'review_scheduled',
    title: 'EHCP annual review meeting scheduled', timestamp: daysAgo(152),
    sourceOrganisationId: 'school_send', category: 'education', sensitivity: 'standard',
    payload: { date: '2026-03-10', time: '10:00', location: 'Greenbank SEND School — Room 4B', isVirtual: false, participants: ['Priya Sharma', 'Nisha Patel', 'Sean Byrne'] },
  },
  {
    id: 'evt-a3', serviceUserId: 'aanya', type: 'referral',
    title: 'CAMHS referral accepted', timestamp: daysAgo(122),
    sourceOrganisationId: 'nhs_merseycare', category: 'health', sensitivity: 'clinical',
  },
  {
    id: 'evt-a4', serviceUserId: 'aanya', type: 'appointment_booked',
    title: 'OT initial assessment appointment booked', timestamp: daysAgo(91),
    sourceOrganisationId: 'nhs_alderhey', category: 'health', sensitivity: 'clinical',
    payload: { date: '2026-04-15', time: '14:30', location: "Alder Hey Children's Hospital — Therapy Suite", isVirtual: true, joinLink: 'https://teams.microsoft.com/l/meetup-join/demo-link-ot-001', participants: ['Rachel Mills', 'Priya Sharma', 'Aanya Sharma'] },
  },
  {
    id: 'evt-a5', serviceUserId: 'aanya', type: 'report_ready',
    title: 'Occupational therapy assessment report available', timestamp: daysAgo(61),
    sourceOrganisationId: 'nhs_alderhey', category: 'health', sensitivity: 'clinical',
    payload: { title: 'OT Assessment Report — Aanya Sharma', docType: 'Clinical Assessment', sourceSystem: 'Alder Hey PAS', status: 'available', sourceLink: 'https://alderhey.nhs.uk/records/demo/ot-report-aanya' },
  },
  {
    id: 'evt-a6', serviceUserId: 'aanya', type: 'document_available',
    title: 'EHCP draft document shared to shared care record', timestamp: daysAgo(30),
    sourceOrganisationId: 'scr_graphnet', category: 'admin', sensitivity: 'standard',
    payload: { title: 'EHCP Draft — Aanya Sharma (2026)', docType: 'EHCP Draft', sourceSystem: 'Graphnet / CIPHA', status: 'available', sourceLink: 'https://cipha.nhs.uk/records/demo/ehcp-draft-aanya-2026' },
  },
  {
    id: 'evt-a7', serviceUserId: 'aanya', type: 'safeguarding_note',
    title: 'Safeguarding information shared (multi-agency)', timestamp: daysAgo(20),
    sourceOrganisationId: 'la_sthelens', category: 'safeguarding', sensitivity: 'safeguarding',
  },
  {
    id: 'evt-a8', serviceUserId: 'aanya', type: 'review_due',
    title: 'Annual EHCP review due — action required', timestamp: daysAgo(14),
    sourceOrganisationId: 'school_send', category: 'education', sensitivity: 'standard',
  },
  {
    id: 'evt-a9', serviceUserId: 'aanya', type: 'placement_confirmed',
    title: 'Specialist school placement confirmed for September 2026', timestamp: daysAgo(7),
    sourceOrganisationId: 'la_sthelens', category: 'social_care', sensitivity: 'standard',
  },

  // ===== Margaret =====
  {
    id: 'evt-m1', serviceUserId: 'margaret', type: 'referral',
    title: 'Hospital admission — acute stroke', timestamp: daysAgo(28),
    sourceOrganisationId: 'nhs_acute', category: 'health', sensitivity: 'clinical',
  },
  {
    id: 'evt-m2', serviceUserId: 'margaret', type: 'assessment',
    title: 'Discharge-to-assess pathway started', timestamp: daysAgo(18),
    sourceOrganisationId: 'nhs_acute', category: 'health', sensitivity: 'clinical',
  },
  {
    id: 'evt-m3', serviceUserId: 'margaret', type: 'assessment',
    title: 'Care Act needs assessment completed', timestamp: daysAgo(12),
    sourceOrganisationId: 'la_sthelens', category: 'social_care', sensitivity: 'standard',
    payload: { title: 'Care Act Assessment — Margaret Okafor', docType: 'Statutory Assessment', sourceSystem: 'Liquidlogic Adults', status: 'available', sourceLink: 'https://sthelens.gov.uk/records/demo/care-act-margaret' },
  },
  {
    id: 'evt-m4', serviceUserId: 'margaret', type: 'appointment_booked',
    title: 'Home adaptation assessment booked', timestamp: daysAgo(9),
    sourceOrganisationId: 'nhs_community', category: 'housing', sensitivity: 'standard',
    payload: { date: '2026-06-30', time: '11:00', location: '14 Rowan Close, St Helens', isVirtual: false, participants: ['Tom Reilly', 'Grace Okafor', 'Margaret Okafor'] },
  },
  {
    id: 'evt-m5', serviceUserId: 'margaret', type: 'report_ready',
    title: 'Grab rails & stair-lift recommendation issued', timestamp: daysAgo(5),
    sourceOrganisationId: 'housing_helena', category: 'housing', sensitivity: 'standard',
    payload: { title: 'Home Adaptation Recommendation — M. Okafor', docType: 'Housing Assessment', sourceSystem: 'Torus Housing Portal', status: 'available', sourceLink: 'https://torus.org.uk/records/demo/adaptation-margaret' },
  },
  {
    id: 'evt-m6', serviceUserId: 'margaret', type: 'plan_updated',
    title: 'Befriending & wellbeing support arranged', timestamp: daysAgo(3),
    sourceOrganisationId: 'vcse_ageuk', category: 'social_care', sensitivity: 'standard',
  },
  {
    id: 'evt-m7', serviceUserId: 'margaret', type: 'review_due',
    title: 'Discharge readiness review due this week', timestamp: daysAgo(1),
    sourceOrganisationId: 'nhs_acute', category: 'health', sensitivity: 'clinical',
  },
]

// ---------------------------------------------------------------------------
// Scripted simulator events (fired in the demo, not in the initial seed)
// ---------------------------------------------------------------------------
export const scriptedEvents: Record<string, TimelineEvent[]> = {
  aanya: [
    { id: 'script-a1', serviceUserId: 'aanya', type: 'appointment_booked', title: 'CAMHS therapy sessions confirmed', timestamp: '', sourceOrganisationId: 'nhs_merseycare', category: 'health', sensitivity: 'clinical' },
    { id: 'script-a2', serviceUserId: 'aanya', type: 'report_ready', title: 'Updated OT assessment available', timestamp: '', sourceOrganisationId: 'nhs_alderhey', category: 'health', sensitivity: 'clinical', payload: { title: 'Updated OT Assessment — Aanya Sharma', docType: 'Clinical Assessment (Updated)', sourceSystem: 'Alder Hey PAS', status: 'available', sourceLink: 'https://alderhey.nhs.uk/records/demo/ot-report-aanya-v2' } },
    { id: 'script-a3', serviceUserId: 'aanya', type: 'review_due', title: 'Annual EHCP review reminder', timestamp: '', sourceOrganisationId: 'school_send', category: 'education', sensitivity: 'standard' },
  ],
  margaret: [
    { id: 'script-m1', serviceUserId: 'margaret', type: 'plan_updated', title: 'Care package hours agreed (4× daily)', timestamp: '', sourceOrganisationId: 'la_sthelens', category: 'social_care', sensitivity: 'standard' },
    { id: 'script-m2', serviceUserId: 'margaret', type: 'report_ready', title: 'District nursing visit schedule issued', timestamp: '', sourceOrganisationId: 'nhs_community', category: 'health', sensitivity: 'clinical', payload: { title: 'District Nursing Plan — M. Okafor', docType: 'Care Plan', sourceSystem: 'Community Health EPR', status: 'available', sourceLink: 'https://communityhealth.nhs.uk/records/demo/dn-margaret' } },
    { id: 'script-m3', serviceUserId: 'margaret', type: 'status_update', title: 'Home adaptations completed — discharge approved', timestamp: '', sourceOrganisationId: 'housing_helena', category: 'housing', sensitivity: 'standard' },
  ],
}

// ---------------------------------------------------------------------------
// Tasks (provider-facing)
// ---------------------------------------------------------------------------
export const seedTasks: Task[] = [
  { id: 'task-a1', serviceUserId: 'aanya', title: 'Review EHC assessment', assigneeParticipantId: 'sean', dueDate: daysAhead(2), priority: 'high', status: 'in_progress', category: 'education' },
  { id: 'task-a2', serviceUserId: 'aanya', title: 'Update support plan', assigneeParticipantId: 'nisha', dueDate: daysAhead(4), priority: 'medium', status: 'awaiting_info', category: 'education' },
  { id: 'task-a3', serviceUserId: 'aanya', title: 'Upload OT meeting notes', assigneeParticipantId: 'rachel', dueDate: daysAhead(1), priority: 'medium', status: 'not_started', category: 'health' },
  { id: 'task-a4', serviceUserId: 'aanya', title: 'Prepare for annual review', assigneeParticipantId: 'sean', dueDate: daysAhead(6), priority: 'high', status: 'not_started', category: 'education' },
  { id: 'task-a5', serviceUserId: 'aanya', title: 'Send placement document to family', assigneeParticipantId: 'carla', dueDate: daysAgo(1), priority: 'low', status: 'in_progress', category: 'social_care' },
  { id: 'task-a6', serviceUserId: 'aanya', title: 'Confirm transport arrangements', assigneeParticipantId: 'sean', dueDate: daysAgo(2), priority: 'high', status: 'on_hold', category: 'admin' },

  { id: 'task-m1', serviceUserId: 'margaret', title: 'Finalise discharge plan', assigneeParticipantId: 'david', dueDate: daysAhead(1), priority: 'high', status: 'in_progress', category: 'health' },
  { id: 'task-m2', serviceUserId: 'margaret', title: 'Arrange care package start', assigneeParticipantId: 'amara', dueDate: daysAhead(2), priority: 'high', status: 'awaiting_info', category: 'social_care' },
  { id: 'task-m3', serviceUserId: 'margaret', title: 'Confirm adaptations installed', assigneeParticipantId: 'fiona', dueDate: daysAhead(3), priority: 'medium', status: 'in_progress', category: 'housing' },
  { id: 'task-m4', serviceUserId: 'margaret', title: 'Schedule district nurse visits', assigneeParticipantId: 'tom', dueDate: daysAhead(1), priority: 'medium', status: 'not_started', category: 'health' },
]

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------
export const seedDocuments: DocumentRecord[] = [
  { id: 'doc-a1', serviceUserId: 'aanya', title: 'OT Assessment Report', docType: 'Clinical Assessment', sourceOrganisationId: 'nhs_alderhey', status: 'available', category: 'health', sensitivity: 'clinical', sourceLink: '#', timestamp: daysAgo(61) },
  { id: 'doc-a2', serviceUserId: 'aanya', title: 'EHCP Draft (2026)', docType: 'EHCP Draft', sourceOrganisationId: 'scr_graphnet', status: 'available', category: 'admin', sensitivity: 'standard', sourceLink: '#', timestamp: daysAgo(30) },
  { id: 'doc-a3', serviceUserId: 'aanya', title: 'Educational Psychology Report', docType: 'Report', sourceOrganisationId: 'school_send', status: 'pending', category: 'education', sensitivity: 'standard', sourceLink: '#', timestamp: daysAgo(8) },
  { id: 'doc-m1', serviceUserId: 'margaret', title: 'Care Act Assessment', docType: 'Statutory Assessment', sourceOrganisationId: 'la_sthelens', status: 'available', category: 'social_care', sensitivity: 'standard', sourceLink: '#', timestamp: daysAgo(12) },
  { id: 'doc-m2', serviceUserId: 'margaret', title: 'Home Adaptation Recommendation', docType: 'Housing Assessment', sourceOrganisationId: 'housing_helena', status: 'available', category: 'housing', sensitivity: 'standard', sourceLink: '#', timestamp: daysAgo(5) },
]

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------
export const seedAppointments: Appointment[] = [
  { id: 'apt-a1', serviceUserId: 'aanya', title: 'CAMHS Appointment', date: '2026-06-22', time: '13:00', location: 'Mersey Care — CAMHS Clinic', isVirtual: false, sourceOrganisationId: 'nhs_merseycare', category: 'health', sensitivity: 'clinical', participantNames: ['Dr Yasmin Hassan', 'Priya Sharma'] },
  { id: 'apt-a2', serviceUserId: 'aanya', title: 'SEN Review Meeting', date: '2026-06-29', time: '14:00', location: 'Greenbank SEND School', isVirtual: false, sourceOrganisationId: 'school_send', category: 'education', sensitivity: 'standard', participantNames: ['Nisha Patel', 'Sean Byrne', 'Priya Sharma'] },
  { id: 'apt-a3', serviceUserId: 'aanya', title: 'Speech & Language', date: '2026-07-05', time: '11:30', location: 'Alder Hey — Therapy Suite', isVirtual: true, joinLink: '#', sourceOrganisationId: 'nhs_alderhey', category: 'health', sensitivity: 'clinical', participantNames: ['Rachel Mills', 'Priya Sharma'] },
  { id: 'apt-m1', serviceUserId: 'margaret', title: 'Home adaptation assessment', date: '2026-06-30', time: '11:00', location: '14 Rowan Close, St Helens', isVirtual: false, sourceOrganisationId: 'nhs_community', category: 'housing', sensitivity: 'standard', participantNames: ['Tom Reilly', 'Grace Okafor'] },
  { id: 'apt-m2', serviceUserId: 'margaret', title: 'Discharge planning meeting', date: '2026-07-01', time: '15:30', location: 'Whiston Hospital — Ward 3C', isVirtual: true, joinLink: '#', sourceOrganisationId: 'nhs_acute', category: 'health', sensitivity: 'clinical', participantNames: ['David Hughes', 'Amara Singh', 'Grace Okafor'] },
]

// ---------------------------------------------------------------------------
// Message threads
// ---------------------------------------------------------------------------
export const seedThreads: MessageThread[] = [
  {
    id: 'thr-a1', serviceUserId: 'aanya', subject: 'Annual review preparation',
    participantIds: ['priya', 'sean', 'nisha'],
    messages: [
      { id: 'msg-a1', fromParticipantId: 'sean', body: 'Hi Priya — we’re booking Aanya’s annual review. Are you free week commencing 29th June?', timestamp: daysAgo(5) },
      { id: 'msg-a2', fromParticipantId: 'priya', body: 'Yes, mornings work best for me. Thank you.', timestamp: daysAgo(4) },
    ],
  },
  {
    id: 'thr-m1', serviceUserId: 'margaret', subject: 'Home adaptations before discharge',
    participantIds: ['grace', 'fiona', 'tom'],
    messages: [
      { id: 'msg-m1', fromParticipantId: 'tom', body: 'Grab rails recommended for hallway and bathroom; referring to Torus for fitting.', timestamp: daysAgo(5) },
      { id: 'msg-m2', fromParticipantId: 'fiona', body: 'Booked for Thursday. Stair-lift survey to follow.', timestamp: daysAgo(4) },
    ],
  },
]

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export const seedNotifications: Notification[] = [
  { id: 'notif-a1', serviceUserId: 'aanya', eventId: 'evt-a8', message: 'Annual EHCP review is due — please take action.', timestamp: daysAgo(14), read: false },
  { id: 'notif-a2', serviceUserId: 'aanya', eventId: 'evt-a9', message: 'Specialist school placement confirmed for September 2026.', timestamp: daysAgo(7), read: false },
  { id: 'notif-a3', serviceUserId: 'aanya', eventId: 'evt-a6', message: 'EHCP draft document has been shared to the shared care record.', timestamp: daysAgo(30), read: true },
  { id: 'notif-m1', serviceUserId: 'margaret', eventId: 'evt-m7', message: 'Discharge readiness review is due this week.', timestamp: daysAgo(1), read: false },
  { id: 'notif-m2', serviceUserId: 'margaret', eventId: 'evt-m5', message: 'Home adaptation recommendation issued by Torus Housing.', timestamp: daysAgo(5), read: true },
]

// ---------------------------------------------------------------------------
// Access log (audit) — pre-seeded so governance screens are populated
// ---------------------------------------------------------------------------
export const seedAccessLog: AccessLogEntry[] = [
  { id: 'log-1', actorParticipantId: 'yasmin', serviceUserId: 'aanya', action: 'accessed_document', lawfulBasis: 'Direct Care', detail: 'Viewed OT Assessment Report', timestamp: daysAgo(2) },
  { id: 'log-2', actorParticipantId: 'carla', serviceUserId: 'aanya', action: 'viewed_record', lawfulBasis: 'Safeguarding', detail: 'Accessed Aanya Sharma record', timestamp: daysAgo(2) },
  { id: 'log-3', actorParticipantId: 'priya', serviceUserId: 'aanya', action: 'updated_record', lawfulBasis: 'Consent', detail: 'Uploaded supporting evidence', timestamp: daysAgo(3) },
  { id: 'log-4', actorParticipantId: 'amara', serviceUserId: 'margaret', action: 'viewed_record', lawfulBasis: 'Statutory Requirement', detail: 'Accessed Margaret Okafor record', timestamp: daysAgo(1) },
  { id: 'log-5', actorParticipantId: 'david', serviceUserId: 'margaret', action: 'updated_record', lawfulBasis: 'Direct Care', detail: 'Updated discharge plan', timestamp: daysAgo(1) },
  { id: 'log-6', actorParticipantId: 'sean', serviceUserId: 'aanya', action: 'changed_permissions', lawfulBasis: 'Statutory Requirement', detail: 'Granted OT access to education category', timestamp: daysAgo(4) },
  { id: 'log-7', actorParticipantId: 'fiona', serviceUserId: 'margaret', action: 'accessed_document', lawfulBasis: 'Legal Obligation', detail: 'Viewed Home Adaptation Recommendation', timestamp: daysAgo(3) },
]

// ---------------------------------------------------------------------------
// Journey stages per domain (the Referral → Review stepper)
// ---------------------------------------------------------------------------
export const journeyStages: Record<string, JourneyStage[]> = {
  aanya: [
    { key: 'referral', label: 'Referral', state: 'complete' },
    { key: 'assessment', label: 'Assessment', state: 'in_progress' },
    { key: 'plan', label: 'Plan', state: 'in_progress' },
    { key: 'support', label: 'Support', state: 'in_progress' },
    { key: 'review', label: 'Review', state: 'upcoming' },
  ],
  margaret: [
    { key: 'admission', label: 'Admission', state: 'complete' },
    { key: 'assessment', label: 'Assessment', state: 'complete' },
    { key: 'plan', label: 'Plan', state: 'in_progress' },
    { key: 'discharge', label: 'Discharge', state: 'in_progress' },
    { key: 'review', label: 'Review', state: 'upcoming' },
  ],
}
