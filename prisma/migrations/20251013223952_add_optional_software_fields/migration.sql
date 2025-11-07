-- AlterTable
ALTER TABLE "Software" ADD COLUMN     "repoUrl" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "webUrl" TEXT;
