// ---------------------------------------------------------------------------
// OneView — coordination-layer domain model
//
// The platform is NOT a SEND parent portal. It is a transferable coordination
// layer. Permissions hang off RELATIONSHIPS (participant ↔ service user), not
// off user types. The service user is always the centre.
// ---------------------------------------------------------------------------

// Which "world" a participant belongs to.
export type Side = 'service_user' | 'service_provider'

// Organisations on the provider side.
export type OrgType =
  | 'LocalAuthority'
  | 'NHS'
  | 'School'
  | 'Police'
  | 'Housing'
  | 'VCSE'
  | 'Private'

export interface Organisation {
  id: string
  name: string
  shortName: string
  type: OrgType
}

// Worked examples ("domains") the same layer can serve.
export type Domain = 'SEND' | 'AdultSocialCare'

export interface ServiceUser {
  id: string
  name: string
  age: number
  domain: Domain
  /** e.g. "Autism Spectrum Disorder — EHCP in progress" or "Post-stroke discharge" */
  contextLabel: string
  status: string
  summary: string
  avatarColor: string
}

// Anyone who can sign in. Service-user-side participants have no org.
export interface Participant {
  id: string
  name: string
  side: Side
  /** Human-readable base role, e.g. "Parent", "Advocate", "SEND Case Officer". */
  baseRole: string
  organisationId?: string
  avatarColor: string
}

// ---------------------------------------------------------------------------
// Coordination categories + sensitivity
// ---------------------------------------------------------------------------
export type Category =
  | 'education'
  | 'health'
  | 'social_care'
  | 'safeguarding'
  | 'housing'
  | 'admin'

// Higher-sensitivity items require a lawful basis that covers them. A standard
// relationship (e.g. a parent on Consent) never sees safeguarding/police items.
export type Sensitivity = 'standard' | 'clinical' | 'safeguarding' | 'police'

export type LawfulBasis =
  | 'Consent'
  | 'Direct Care'
  | 'Safeguarding'
  | 'Legal Obligation'
  | 'Statutory Requirement'

export type Action =
  | 'upload_evidence'
  | 'message'
  | 'view_appointments'
  | 'create_assessment'
  | 'assign_tasks'
  | 'upload_reports'
  | 'coordinate_meetings'
  | 'update_appointments'
  | 'edit_decisions'

// ---------------------------------------------------------------------------
// Relationship — the heart of the model
// ---------------------------------------------------------------------------
export interface Relationship {
  id: string
  participantId: string
  serviceUserId: string
  /** e.g. "Mother", "Carer", "Advocate", "Case Officer", "Health Professional". */
  relationshipType: string
  lawfulBasis: LawfulBasis
  allowedCategories: Category[]
  /** Sensitivities this relationship is permitted to see beyond 'standard'. */
  allowedSensitivities: Sensitivity[]
  allowedActions: Action[]
}

// ---------------------------------------------------------------------------
// Coordination-layer entities — every item belongs to a service user, comes
// from a source organisation, has a category + sensitivity.
// ---------------------------------------------------------------------------
export type EventType =
  | 'referral'
  | 'assessment'
  | 'appointment_booked'
  | 'document_available'
  | 'report_ready'
  | 'review_scheduled'
  | 'review_due'
  | 'placement_confirmed'
  | 'plan_updated'
  | 'safeguarding_note'
  | 'status_update'

export interface AppointmentPayload {
  date: string
  time: string
  location: string
  isVirtual: boolean
  joinLink?: string
  participants: string[]
}

export type DocumentStatus = 'available' | 'pending'

export interface DocumentMetaPayload {
  title: string
  docType: string
  sourceSystem: string
  status: DocumentStatus
  sourceLink: string
}

export interface TimelineEvent {
  id: string
  serviceUserId: string
  type: EventType
  title: string
  timestamp: string
  sourceOrganisationId: string
  category: Category
  sensitivity: Sensitivity
  payload?: AppointmentPayload | DocumentMetaPayload
}

export type TaskStatus =
  | 'not_started'
  | 'in_progress'
  | 'awaiting_info'
  | 'on_hold'
  | 'closed'

export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  serviceUserId: string
  title: string
  /** Participant the task is assigned to (usually a provider). */
  assigneeParticipantId: string
  dueDate: string
  priority: TaskPriority
  status: TaskStatus
  category: Category
}

export interface DocumentRecord {
  id: string
  serviceUserId: string
  title: string
  docType: string
  sourceOrganisationId: string
  status: DocumentStatus
  category: Category
  sensitivity: Sensitivity
  sourceLink: string
  timestamp: string
}

export interface Appointment {
  id: string
  serviceUserId: string
  title: string
  date: string
  time: string
  location: string
  isVirtual: boolean
  joinLink?: string
  sourceOrganisationId: string
  category: Category
  sensitivity: Sensitivity
  participantNames: string[]
}

export interface Message {
  id: string
  fromParticipantId: string
  body: string
  timestamp: string
}

export interface MessageThread {
  id: string
  serviceUserId: string
  subject: string
  participantIds: string[]
  messages: Message[]
}

export interface Notification {
  id: string
  serviceUserId: string
  eventId?: string
  message: string
  timestamp: string
  read: boolean
}

// Audit — every realised access is logged; powers the governance screens.
export type AccessAction =
  | 'viewed_record'
  | 'updated_record'
  | 'accessed_document'
  | 'changed_permissions'
  | 'sent_message'

export interface AccessLogEntry {
  id: string
  actorParticipantId: string
  serviceUserId: string
  action: AccessAction
  lawfulBasis: LawfulBasis
  detail: string
  timestamp: string
}

// ---------------------------------------------------------------------------
// Journey stages (the Referral → Review stepper)
// ---------------------------------------------------------------------------
export type JourneyStageState = 'complete' | 'in_progress' | 'upcoming'

export interface JourneyStage {
  key: string
  label: string
  state: JourneyStageState
}
