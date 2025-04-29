/*
  Warnings:

  - A unique constraint covering the columns `[devise,succursaleId]` on the table `caisses` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Compte" ADD COLUMN     "solde" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "caisses_devise_succursaleId_key" ON "caisses"("devise", "succursaleId");
