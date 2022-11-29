CREATE TABLE IF NOT EXISTS "DialogflowSession" (
    id uuid DEFAULT uuid_generate_v4 () NOT NULL,
    "userId" uuid NOT NULL CONSTRAINT "FK_DIALOGFLOW_SESSION__USER_ID" REFERENCES "User",
    "projectId" varchar(512) NOT NULL,
    "sessionId" uuid NOT NULL,
    "requestsMetadata" jsonb DEFAULT '[]' NOT NULL,
    "responsesMetadata" jsonb DEFAULT '[]' NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "PK_DIALOGFLOW_SESSION" PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS "UQ_DIALOGFLOW_SESSION" ON "DialogflowSession" ("userId", "projectId", "sessionId");

