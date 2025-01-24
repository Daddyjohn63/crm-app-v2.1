import { Card, List, Profile, User } from '@/db/schema';

export type Plan = 'free' | 'basic' | 'premium';
export type Role = 'admin' | 'guest' | 'member';
export type BoardPermission = 'owner' | 'admin' | 'editor' | 'viewer';

export type UserProfile = {
  id: UserId;
  name: string | null;
  image: string | null;
};

export type UserId = number;

export type UserSession = {
  id: UserId;
};

export type MemberInfo = {
  name: string | null;
  userId: UserId;
  image: string | null;
  role: Role;
};

export const SALES_STAGES = {
  LEAD: 'lead',
  PROSPECT: 'prospect',
  QUALIFIED_OPPORTUNITY: 'qualified_opportunity',
  PROPOSAL: 'proposal',
  NEGOTIATION: 'negotiation',
  CLOSED_WON: 'closed_won',
  CLOSED_LOST: 'closed_lost'
} as const;

export const SALES_STAGE_FILTER_OPTIONS = {
  ALL: 'all_stages',
  ...SALES_STAGES
} as const;

// Type for the values
export type SalesStage = (typeof SALES_STAGES)[keyof typeof SALES_STAGES];
export type SalesStageFilter =
  (typeof SALES_STAGE_FILTER_OPTIONS)[keyof typeof SALES_STAGE_FILTER_OPTIONS];

export type ListWithCards = List & {
  cards: CardWithProfile[];
};

export type CardWithProfile = Card & {
  assignedUserProfile: {
    displayName: string | null;
  } | null;
};

export type CardWithList = Card & { list: List };

export type UserWithProfile = User & {
  displayName: string | null;
};

// First, define our base types
export type CardUpdate = {
  cardId: number;
  name: string;
  description?: string | null;
  assignedTo: number; // Changed from string to number since that's what DB expects
  dueDate?: Date | null;
  listId: number;
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
};
