import { z } from 'zod';

export const schema = z.object({
  business_name: z.string().min(1),
  primary_address: z.string().optional(),
  primary_email: z.string().email().min(1),
  primary_phone: z.string().optional(),
  business_description: z.string().optional(),
  date_onboarded: z.date().optional(),
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
