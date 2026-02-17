-- AlterEnum
ALTER TYPE "Color" ADD VALUE 'cyan';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "shippedAt" TIMESTAMP(3);
