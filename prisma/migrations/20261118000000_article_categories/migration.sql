CREATE TABLE "ArticleCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);
ALTER TABLE "Article" ADD COLUMN "categoryId" TEXT;
CREATE INDEX "Article_categoryId_idx" ON "Article"("categoryId");
ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "ArticleCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
