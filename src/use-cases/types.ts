export type Plan = 'free' | 'basic' | 'premium';
export type Role = 'owner' | 'admin' | 'member';

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

// Type for the values
export type SalesStage = (typeof SALES_STAGES)[keyof typeof SALES_STAGES];

// export type ClientInfo = {
//   clientId: number;
//   business_name: string;
//   primary_address: string | null;
//   primary_email: string | null;
//   primary_phone: string | null;
//   business_description: string | null;
//   date_onboarded: Date | null;
//   additional_info: string | null;
// };
