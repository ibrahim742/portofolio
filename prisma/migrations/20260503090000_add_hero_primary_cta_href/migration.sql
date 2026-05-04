ALTER TABLE "HeroContent" ADD COLUMN "primaryCtaHref" TEXT NOT NULL DEFAULT '/cv/ibrahim-setiawan-cv.pdf';

UPDATE "HeroContent"
SET "primaryCta" = 'Download CV',
    "primaryCtaHref" = '/cv/ibrahim-setiawan-cv.pdf'
WHERE "key" = 'main'
  AND "primaryCta" = 'Lihat Portofolio';
