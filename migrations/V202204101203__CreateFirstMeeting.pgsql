DO $$
BEGIN
    CREATE TYPE "Gender" AS ENUM (
        'Male',
        'Female'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

DO $$
BEGIN
    CREATE TYPE "FirstMeetingStatus" AS ENUM (
        'StartMeeting',
        'AskFirstname',
        'AskLastname',
        'AskGender',
        'EndMeeting'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

CREATE TABLE IF NOT EXISTS "FirstMeeting" (
    id uuid DEFAULT uuid_generate_v4 () NOT NULL,
    "userId" uuid NOT NULL CONSTRAINT "FK_FIRST_MEETING__USER_ID" REFERENCES "User",
    "status" "FirstMeetingStatus" NOT NULL,
    "firstname" varchar(100) NOT NULL,
    "lastname" varchar(100) NOT NULL,
    "gender" "Gender" NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "PK_FIRST_MEETING" PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS "UQ_FIRST_MEETING" ON "FirstMeeting" ("userId");

