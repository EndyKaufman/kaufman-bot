DO $$
BEGIN
    ALTER TABLE "User"
        ADD "debugMode" boolean DEFAULT FALSE NOT NULL;
EXCEPTION
    WHEN duplicate_column THEN
        NULL;
END
$$;

