import type { NavItem } from '@/components/ui/AppShell'

export const SERVICE_USER_NAV: NavItem[] = [
  { label: 'Home', href: '/dashboard', icon: 'home' },
  { label: 'My journey', href: '/dashboard/journey', icon: 'journey' },
  { label: 'Tasks', href: '/dashboard/tasks', icon: 'tasks' },
  { label: 'Messages', href: '/dashboard/messages', icon: 'messages' },
  { label: 'Appointments', href: '/dashboard/appointments', icon: 'appointments' },
  { label: 'Documents', href: '/dashboard/documents', icon: 'documents' },
  { label: 'People involved', href: '/dashboard/people', icon: 'people' },
  { label: 'My permissions', href: '/dashboard/permissions', icon: 'permissions' },
  { label: 'Help', href: '/dashboard/help', icon: 'help', badgeKey: 'notifications' },
]

export const PROVIDER_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/provider', icon: 'dashboard' },
  { label: 'My caseload', href: '/provider/caseload', icon: 'caseload' },
  { label: 'Tasks', href: '/provider/tasks', icon: 'tasks' },
  { label: 'Messages', href: '/provider/messages', icon: 'messages' },
  { label: 'Calendar', href: '/provider/calendar', icon: 'calendar' },
  { label: 'People', href: '/provider/people', icon: 'people' },
  { label: 'Reports', href: '/provider/reports', icon: 'reports' },
  { label: 'Resources', href: '/provider/resources', icon: 'resources' },
]

export const ADMIN_NAV: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: 'overview' },
  { label: 'Users', href: '/admin/users', icon: 'users' },
  { label: 'Organisations', href: '/admin/organisations', icon: 'organisations' },
  { label: 'Roles & permissions', href: '/admin/roles', icon: 'roles' },
  { label: 'Relationships', href: '/admin/relationships', icon: 'relationships' },
  { label: 'Consent management', href: '/admin/consent', icon: 'consent' },
  { label: 'Data access', href: '/admin/data-access', icon: 'dataaccess' },
  { label: 'Audit log', href: '/admin/audit', icon: 'audit' },
  { label: 'Reports', href: '/admin/reports', icon: 'reports' },
  { label: 'Settings', href: '/admin/settings', icon: 'settings' },
]
