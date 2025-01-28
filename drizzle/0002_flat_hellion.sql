ALTER TABLE "cards" ALTER COLUMN "assigned_to" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "assigned_to" DROP NOT NULL;