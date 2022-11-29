CREATE TABLE IF NOT EXISTS "User" (
    id uuid DEFAULT uuid_generate_v4 () NOT NULL,
    "telegramId" varchar(64) NOT NULL,
    "langCode" varchar(64) DEFAULT 'en' NOT NULL,
    CONSTRAINT "PK_USERS" PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS "UQ_USERS__TELEGRAM_ID" ON "User" ("telegramId");

