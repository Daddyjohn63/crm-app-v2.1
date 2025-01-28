DO $$ BEGIN
 CREATE TYPE "public"."task_status" AS ENUM('todo', 'in_progress', 'done', 'blocked');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "status" "task_status" NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cards_list_id_idx" ON "cards" USING btree ("list_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cards_assigned_to_idx" ON "cards" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cards_list_order_idx" ON "cards" USING btree ("list_id","order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lists_board_id_idx" ON "lists" USING btree ("board_id");