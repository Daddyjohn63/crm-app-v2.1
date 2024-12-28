ALTER TABLE "services" ALTER COLUMN "service_description" SET DATA TYPE varchar(3500);--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "included_services" SET DATA TYPE varchar(2000);--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "deleivery_process" SET DATA TYPE varchar(3000);