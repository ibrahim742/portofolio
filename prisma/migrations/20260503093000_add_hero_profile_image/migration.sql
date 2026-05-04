ALTER TABLE "HeroContent" ADD COLUMN "profileImage" TEXT NOT NULL DEFAULT '';
ALTER TABLE "HeroContent" ADD COLUMN "profileImageAlt" TEXT NOT NULL DEFAULT '';

UPDATE "HeroContent"
SET "profileImageAlt" = "name"
WHERE "key" = 'main'
  AND "profileImageAlt" = '';
