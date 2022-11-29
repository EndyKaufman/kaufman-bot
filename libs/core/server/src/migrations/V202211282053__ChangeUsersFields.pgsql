ALTER TABLE "User"
    ALTER COLUMN "langCode" DROP NOT NULL;

ALTER TABLE "User"
    ALTER COLUMN "langCode" DROP DEFAULT;

UPDATE
    "User"
SET
    "langCode" = NULL
WHERE
    "langCode" = 'en';
