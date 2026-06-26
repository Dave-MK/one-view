export type Role = 'Parent' | 'SENCO' | 'SocialWorker' | 'CAMHSClinician' | 'OT' | 'Caseworker'
export type EventCategory = 'education' | 'health' | 'social_care' | 'admin'
export type EventType =
  | 'ehc_needs_assessment_started'
  | 'ehcp_review_scheduled'
  | 'ot_report_ready'
  | 'camhs_referral_accepted'
  | 'appointment_booked'
  | 'document_available'
  | 'annual_review_due'
  | 'placement_confirmed'

export type DocumentStatus = 'available' | 'pending'

export interface ServiceUser {
  id: string
  name: string
  age: number
  summary: string
  sendCategory: string
}

export interface Person {
  id: string
  name: string
  role: Role
  org: string
}

export interface SourceSystem {
  id: string
  name: string
  org: string
  kind: string
}

export interface AppointmentPayload {
  date: string
  time: string
  location: string
  isVirtual: boolean
  joinLink?: string
  participants: string[]
}

export interface DocumentMetaPayload {
  title: string
  docType: string
  sourceSystem: string
  status: DocumentStatus
  sourceLink: string
}

export interface OneViewEvent {
  id: string
  type: EventType
  title: string
  timestamp: string
  sourceSystemId: string
  category: EventCategory
  payload?: AppointmentPayload | DocumentMetaPayload
}

export interface ConsentRule {
  serviceUserId: string
  granteeRole: Role
  allowedCategories: EventCategory[]
}

export interface Notification {
  id: string
  eventId: string
  message: string
  timestamp: string
  read: boolean
}
