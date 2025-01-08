import { pgEnum } from 'drizzle-orm/pg-core';

// System-wide role enum (determines what a user can do in the system)
export const roleEnum = pgEnum('role', ['admin', 'guest']);

// Account type enum
export const accountTypeEnum = pgEnum('type', ['email', 'google', 'github']);

// Sales stage enum
export const salesStageEnum = pgEnum('sales_stage', [
  'lead',
  'prospect',
  'qualified_opportunity',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost'
]);

// Board-specific permission enum (determines what a user can do within a specific board)
export const boardPermissionEnum = pgEnum('board_permission_level', [
  'owner', // Can delete board and manage all permissions
  'admin', // Can manage board settings and permissions
  'editor', // Can create/edit cards and lists
  'viewer' // Can only view the board
]);

export const actionEnum = pgEnum('action', ['CREATE', 'UPDATE', 'DELETE']);

export const entityTypeEnum = pgEnum('entity_type', ['BOARD', 'LIST', 'CARD']);

// Type exports
export type Role = (typeof roleEnum.enumValues)[number];
export type AccountType = (typeof accountTypeEnum.enumValues)[number];
export type SalesStage = (typeof salesStageEnum.enumValues)[number];
export type BoardPermission = (typeof boardPermissionEnum.enumValues)[number];
export type Action = (typeof actionEnum.enumValues)[number];
export type EntityType = (typeof entityTypeEnum.enumValues)[number];
