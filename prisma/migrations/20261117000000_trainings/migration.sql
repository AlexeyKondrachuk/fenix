CREATE TABLE "Training" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "position" INTEGER NOT NULL DEFAULT 0,
  "content" JSONB NOT NULL,
  CONSTRAINT "Training_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Training_slug_key" ON "Training"("slug");
