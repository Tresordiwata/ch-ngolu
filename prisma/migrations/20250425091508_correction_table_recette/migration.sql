/*
  Warnings:

  - The `estCloturee` column on the `Recette` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `dateRecette` to the `Recette` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('A', 'D', 'S');

-- AlterTable
ALTER TABLE "Recette" ADD COLUMN     "dateRecette" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'A',
DROP COLUMN "estCloturee",
ADD COLUMN     "estCloturee" "ClotureStatus" NOT NULL DEFAULT 'N';

-- AlterTable
ALTER TABLE "depenses" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'A';
