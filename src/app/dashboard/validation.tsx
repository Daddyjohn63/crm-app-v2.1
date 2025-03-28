import { CardUpdate } from '@/use-cases/types';
import { sanitizeUserInput } from '@/util/sanitize';
import { z } from 'zod';

export const schema = z.object({
  business_name: z.string().min(1),
  primary_address: z.string().optional(),
  primary_email: z.string().email().min(1),
  primary_phone: z.string().optional(),
  business_description: z.string().optional(),
  sales_stage: z
    .enum([
      'lead',
      'prospect',
      'qualified_opportunity',
      'proposal',
      'negotiation',
      'closed_won',
      'closed_lost'
    ])
    .default('lead'),
  date_onboarded: z.date().optional(),
  annual_revenue_expected: z.string().optional(),
  additional_info: z.string().optional()
});

export const contactSchema = z.object({
  last_name: z.string().min(1),
  first_name: z.string().min(1),
  job_title: z.string().min(1),
  email: z.string().email().min(1),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().optional()
});

export const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  included_services: z.string().optional(),
  delivery_process: z.string().optional(),
  pricing: z.string().optional()
});

// Project Schema
export const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  client_id: z.string().min(1)
});

// Drag and Drop Schemas
export const listReorderSchema = z.object({
  boardId: z.number(),
  items: z.array(
    z.object({
      id: z.number(),
      order: z.number().min(0)
    })
  )
});

export const cardReorderSchema = z.object({
  listId: z.number(),
  cards: z.array(
    z.object({
      id: z.number(),
      order: z.number().min(0),
      listId: z.number()
    })
  )
});

export const cardMoveSchema = z.object({
  cardId: z.number(),
  sourceListId: z.number(),
  destinationListId: z.number(),
  order: z.number().min(0)
});

export const updateCardSchema = z.object({
  cardId: z.number({
    required_error: 'Card ID is required',
    invalid_type_error: 'Card ID must be a number'
  }),
  name: z
    .string({
      required_error: 'Name is required'
    })
    .min(1, 'Name cannot be empty'),
  description: z.string().nullable().optional(),
  assignedTo: z.coerce.number({
    required_error: 'Card must be assigned to a user',
    invalid_type_error: 'Invalid user ID'
  }),
  dueDate: z.date().nullable().optional(),
  listId: z.number({
    required_error: 'List ID is required',
    invalid_type_error: 'List ID must be a number'
  }),
  status: z.enum(['todo', 'in_progress', 'done', 'blocked'])
}) satisfies z.ZodType<CardUpdate>;
