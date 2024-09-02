ALTER TABLE "clients" ALTER COLUMN "primary_address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "service_description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN IF EXISTS "primary_email";--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN IF EXISTS "primary_phone";--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN IF EXISTS "business_description";--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN IF EXISTS "date";--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN IF EXISTS "additional_info";