DO $$ 
BEGIN
    ALTER TYPE "public"."role" ADD VALUE IF NOT EXISTS 'guest';
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;