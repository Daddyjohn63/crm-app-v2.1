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

// export const schema = z.object({
//   business_name: z
//     .string()
//     .min(1, { message: 'Business name must be at least 6 characters.' })
//     .transform(sanitizeUserInput),
//   primary_address: z
//     .string()
//     .min(1, { message: 'You must enter a business address.' })
//     .transform(sanitizeUserInput),
//   primary_email: z
//     .string()
//     .email()
//     .min(4, { message: 'You must enter an email address' })
//     .transform(sanitizeUserInput),
//   primary_phone: z
//     .string()
//     .min(1, { message: 'You must enter a phone number.' })
//     .transform(sanitizeUserInput),
//   business_description: z
//     .string()
//     .min(1, { message: 'You must enter a business description.' })
//     .transform(sanitizeUserInput),
//   date_onboarded: z.date({
//     message: 'You must enter a date'
//   }),
//   additional_info: z
//     .string()
//     .min(1, { message: 'You must enter some additional information.' })
//     .transform(sanitizeUserInput)
// });

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
