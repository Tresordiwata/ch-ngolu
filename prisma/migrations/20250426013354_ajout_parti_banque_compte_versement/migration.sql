/*
  Warnings:

  - The `Status` column on the `utilisateurs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[nom]` on the table `succursales` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "devise" AS ENUM ('USD', 'CDF');

-- CreateEnum
CREATE TYPE "typeOperation" AS ENUM ('A', 'D', 'I');

-- AlterTable
ALTER TABLE "utilisateurs" DROP COLUMN "Status",
ADD COLUMN     "Status" "Status" NOT NULL DEFAULT 'A';

-- CreateTable
CREATE TABLE "Banque" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'A',

    CONSTRAINT "Banque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Caisse" (
    "id" TEXT NOT NULL,
    "succursaleId" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "devise" "devise" NOT NULL DEFAULT 'USD',

    CONSTRAINT "Caisse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaisseOperation" (
    "id" TEXT NOT NULL,
    "caisseId" TEXT NOT NULL,
    "action" "typeOperation" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaisseOperation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compte" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "devise" "devise" NOT NULL,
    "nom" TEXT,
    "banqueId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'A',

    CONSTRAINT "Compte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Versement" (
    "id" TEXT NOT NULL,
    "dateVersement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montant" DOUBLE PRECISION NOT NULL,
    "succursaleId" TEXT NOT NULL,
    "compteId" TEXT NOT NULL,
    "utillisateurId" TEXT NOT NULL,
    "estCloture" "ClotureStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Versement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Banque_nom_key" ON "Banque"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Compte_numero_key" ON "Compte"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "succursales_nom_key" ON "succursales"("nom");

-- AddForeignKey
ALTER TABLE "Caisse" ADD CONSTRAINT "Caisse_succursaleId_fkey" FOREIGN KEY ("succursaleId") REFERENCES "succursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaisseOperation" ADD CONSTRAINT "CaisseOperation_caisseId_fkey" FOREIGN KEY ("caisseId") REFERENCES "Caisse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compte" ADD CONSTRAINT "Compte_banqueId_fkey" FOREIGN KEY ("banqueId") REFERENCES "Banque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Versement" ADD CONSTRAINT "Versement_succursaleId_fkey" FOREIGN KEY ("succursaleId") REFERENCES "succursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Versement" ADD CONSTRAINT "Versement_compteId_fkey" FOREIGN KEY ("compteId") REFERENCES "Compte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Versement" ADD CONSTRAINT "Versement_utillisateurId_fkey" FOREIGN KEY ("utillisateurId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
