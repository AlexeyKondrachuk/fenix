ALTER TABLE "Article" ADD COLUMN "slug" TEXT;
WITH titles AS (
  SELECT "id", COALESCE(NULLIF(left(trim(both '-' from regexp_replace(lower("title"), '[^a-zа-яё0-9]+', '-', 'g')), 100), ''), 'article') AS base
  FROM "Article"
), numbered AS (
  SELECT *, row_number() OVER (PARTITION BY base ORDER BY "id") AS n FROM titles
)
UPDATE "Article" a SET "slug" = numbered.base || CASE WHEN numbered.n > 1 THEN '-' || a."id" ELSE '' END FROM numbered WHERE a."id" = numbered."id";
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");
