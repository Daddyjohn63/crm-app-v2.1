DO $$ 
DECLARE 
    enum_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'role'
    ) INTO enum_exists;

    IF NOT enum_exists THEN
        CREATE TYPE "public"."role" AS ENUM('admin', 'guest', 'member');
    ELSE
        BEGIN
            ALTER TYPE "public"."role" ADD VALUE IF NOT EXISTS 'guest';
            ALTER TYPE "public"."role" ADD VALUE IF NOT EXISTS 'member';
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END IF;
END $$;