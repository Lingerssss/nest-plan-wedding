ALTER TABLE "Task" ADD COLUMN "assignedUserId" TEXT;

CREATE INDEX "Task_assignedUserId_idx" ON "Task"("assignedUserId");

ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
