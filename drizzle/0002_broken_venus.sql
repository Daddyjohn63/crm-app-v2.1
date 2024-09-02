ALTER TABLE "clients" ADD COLUMN "primary_email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "primary_phone" text NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "business_description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "additional_info" text NOT NULL;