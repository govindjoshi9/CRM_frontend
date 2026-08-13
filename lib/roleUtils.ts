export type BackendRole = 
  | 'admin'
  | 'staff'
  | 'manager'
  | 'employee'
  | 'accountant'
  | 'hr'
  | 'ca'
  | 'receptionist'
  | 'client';

export const ADMIN_ROLES: BackendRole[] = ['admin'];

export const STAFF_ROLES: BackendRole[] = [
  'admin',
  'staff',
  'manager',
  'employee',
  'accountant',
  'hr',
  'ca',
  'receptionist'
];

export const CLIENT_ROLES: BackendRole[] = ['client'];

/**
 * Normalizes user role string from backend or store.
 */
export function normalizeRole(role?: string | null, activeRole?: 'staff' | 'client' | null): string {
  if (activeRole === 'client') return 'client';
  if (!role) return 'staff';
  return role.toLowerCase();
}

export function isAdmin(role?: string | null, activeRole?: 'staff' | 'client' | null): boolean {
  const norm = normalizeRole(role, activeRole);
  return norm === 'admin';
}

export function isStaff(role?: string | null, activeRole?: 'staff' | 'client' | null): boolean {
  const norm = normalizeRole(role, activeRole);
  return STAFF_ROLES.includes(norm as BackendRole);
}

export function isClient(role?: string | null, activeRole?: 'staff' | 'client' | null): boolean {
  const norm = normalizeRole(role, activeRole);
  return norm === 'client';
}

/**
 * Gets the dedicated portal route for a given role.
 */
export function getPortalRoute(role?: string | null, activeRole?: 'staff' | 'client' | null): string {
  if (activeRole === 'client') return '/client/portal';
  
  const norm = normalizeRole(role, activeRole);
  
  if (norm === 'admin') {
    return '/admin/dashboard';
  }
  
  if (norm === 'client') {
    return '/client/portal';
  }
  
  return '/staff/dashboard';
}
