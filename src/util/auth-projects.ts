interface Permission {
  role?: 'owner' | 'editor' | 'viewer';
  canEdit?: boolean;
}

export function canAccessSettings(permission: Permission): boolean {
  return permission?.role === 'owner';
}

export function canUseListForm(permission: Permission): boolean {
  return permission?.role === 'owner' || permission?.role === 'editor';
}

export function canEditContent(permission: Permission): boolean {
  return permission?.role === 'owner' || permission?.role === 'editor';
}

export function canDeleteContent(permission: Permission): boolean {
  return permission?.role === 'owner';
}

export function isAtLeastViewer(permission: Permission): boolean {
  return !!permission?.role;
}

export function isAtLeastEditor(permission: Permission): boolean {
  return permission?.role === 'owner' || permission?.role === 'editor';
}

export function isOwner(permission: Permission): boolean {
  return permission?.role === 'owner';
}

// Export the Permission type for use in other files
export type { Permission };
