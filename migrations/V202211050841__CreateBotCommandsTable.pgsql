CREATE TABLE IF NOT EXISTS "State" (
    id uuid DEFAULT uuid_generate_v4 () NOT NULL,
    "userId" uuid NOT NULL CONSTRAINT "FK_STATES__USER_ID" REFERENCES "User",
    "handlerId" varchar(512),
    "messageId" varchar(512) NOT NULL,
    "context" jsonb,
    "response" jsonb,
    "request" jsonb,
    "usedMessageIds" varchar(512)[],
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "PK_STATES" PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS "UQ_STATES" ON "State" ("userId", "handlerId", "messageId");

