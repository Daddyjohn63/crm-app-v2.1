ALTER TABLE "cards" ALTER COLUMN "assigned_to" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "assigned_to" SET NOT NULL;