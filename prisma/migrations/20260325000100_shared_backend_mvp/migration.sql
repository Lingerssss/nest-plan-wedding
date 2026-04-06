ALTER TABLE "User"
ADD COLUMN "displayName" TEXT,
ADD COLUMN "phone" TEXT,
ADD COLUMN "wechatOpenId" TEXT;

UPDATE "User"
SET "displayName" = "username"
WHERE "displayName" IS NULL;

CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX "User_wechatOpenId_key" ON "User"("wechatOpenId");

ALTER TABLE "Session"
ADD COLUMN "clientType" TEXT NOT NULL DEFAULT 'WEB',
ADD COLUMN "lastAccessAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "Session"
SET "lastAccessAt" = "createdAt"
WHERE "lastAccessAt" IS NULL;

ALTER TABLE "Task"
ADD COLUMN "phase" TEXT NOT NULL DEFAULT 'PREPARATION',
ADD COLUMN "scheduledAt" TIMESTAMP(3),
ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "Task_weddingId_phase_sortOrder_idx" ON "Task"("weddingId", "phase", "sortOrder");
CREATE INDEX "Task_weddingId_scheduledAt_idx" ON "Task"("weddingId", "scheduledAt");
