INSERT INTO "User" ("telegramId")
    VALUES ('testId')
ON CONFLICT ("telegramId")
    DO NOTHING;

