CREATE TABLE "BrandingContent" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'main',
    "headerImage" TEXT NOT NULL DEFAULT '',
    "faviconImage" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandingContent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BrandingContent_key_key" ON "BrandingContent"("key");
