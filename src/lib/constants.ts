import type { Category, OrgType } from '@/types'

export const PRODUCT_NAME = 'OneView'
export const PRODUCT_TAGLINE = 'Working together. Supporting better lives.'

// Category display config
export const CATEGORY_META: Record<Category, { label: string; color: string; bg: string }> = {
  education: { label: 'Education', color: '#1d4ed8', bg: '#eff6ff' },
  health: { label: 'Health', color: '#15803d', bg: '#f0fdf4' },
  social_care: { label: 'Social Care', color: '#7e22ce', bg: '#faf5ff' },
  safeguarding: { label: 'Safeguarding', color: '#dc2626', bg: '#fef2f2' },
  housing: { label: 'Housing', color: '#c2410c', bg: '#fff7ed' },
  admin: { label: 'Admin', color: '#475569', bg: '#f8fafc' },
}

export const ORG_TYPE_LABEL: Record<OrgType, string> = {
  LocalAuthority: 'Local Authority',
  NHS: 'NHS',
  School: 'School',
  Police: 'Police',
  Housing: 'Housing',
  VCSE: 'VCSE',
  Private: 'Private provider',
}
