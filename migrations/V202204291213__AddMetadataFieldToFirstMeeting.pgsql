DO $$
BEGIN
    ALTER TABLE "FirstMeeting"
        ADD "messagesMetadata" jsonb DEFAULT '{}';
EXCEPTION
    WHEN duplicate_column THEN
        NULL;
END
$$;

