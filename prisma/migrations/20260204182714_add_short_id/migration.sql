ALTER TABLE "Wedding" ADD COLUMN "shortId" TEXT;

WITH numbered_weddings AS (
    SELECT "id", ROW_NUMBER() OVER (ORDER BY "createdAt", "id") AS row_num
    FROM "Wedding"
)
UPDATE "Wedding" AS w
SET "shortId" = LPAD((100000 + numbered_weddings.row_num - 1)::text, 6, '0')
FROM numbered_weddings
WHERE w."id" = numbered_weddings."id"
  AND w."shortId" IS NULL;

ALTER TABLE "Wedding" ALTER COLUMN "shortId" SET NOT NULL;

CREATE UNIQUE INDEX "Wedding_shortId_key" ON "Wedding"("shortId");
CREATE INDEX "Wedding_shortId_idx" ON "Wedding"("shortId");
