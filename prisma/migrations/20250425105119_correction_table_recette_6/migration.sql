/*
  Warnings:

  - The primary key for the `recettes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "recettes" DROP CONSTRAINT "recettes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "recettes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "recettes_id_seq";
