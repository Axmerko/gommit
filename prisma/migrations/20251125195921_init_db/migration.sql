-- CreateTable
CREATE TABLE "GolemLog" (
    "id" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GolemLog_pkey" PRIMARY KEY ("id")
);
