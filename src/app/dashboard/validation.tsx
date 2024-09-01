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
