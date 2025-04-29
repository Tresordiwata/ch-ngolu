/*
  Warnings:

  - The `Status` column on the `Rubrique` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `Status` column on the `succursales` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'B';

-- AlterTable
ALTER TABLE "Rubrique" DROP COLUMN "Status",
ADD COLUMN     "Status" "Status" NOT NULL DEFAULT 'A';

-- AlterTable
ALTER TABLE "succursales" DROP COLUMN "Status",
ADD COLUMN     "Status" "Status" NOT NULL DEFAULT 'A';
