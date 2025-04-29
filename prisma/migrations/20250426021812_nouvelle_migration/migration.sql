/*
  Warnings:

  - You are about to drop the `Banque` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Caisse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Versement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Caisse" DROP CONSTRAINT "Caisse_succursaleId_fkey";

-- DropForeignKey
ALTER TABLE "CaisseOperation" DROP CONSTRAINT "CaisseOperation_caisseId_fkey";

-- DropForeignKey
ALTER TABLE "Compte" DROP CONSTRAINT "Compte_banqueId_fkey";

-- DropForeignKey
ALTER TABLE "Versement" DROP CONSTRAINT "Versement_compteId_fkey";

-- DropForeignKey
ALTER TABLE "Versement" DROP CONSTRAINT "Versement_succursaleId_fkey";

-- DropForeignKey
ALTER TABLE "Versement" DROP CONSTRAINT "Versement_utillisateurId_fkey";

-- AlterTable
ALTER TABLE "utilisateurs" ALTER COLUMN "Status" DROP NOT NULL;

-- DropTable
DROP TABLE "Banque";

-- DropTable
DROP TABLE "Caisse";

-- DropTable
DROP TABLE "Versement";

-- CreateTable
CREATE TABLE "banques" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'A',

    CONSTRAINT "banques_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caisses" (
    "id" TEXT NOT NULL,
    "succursaleId" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "devise" "devise" NOT NULL DEFAULT 'USD',

    CONSTRAINT "caisses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "versements" (
    "id" TEXT NOT NULL,
    "dateVersement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montant" DOUBLE PRECISION NOT NULL,
    "succursaleId" TEXT NOT NULL,
    "compteId" TEXT NOT NULL,
    "utillisateurId" TEXT NOT NULL,
    "estCloture" "ClotureStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "versements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "banques_nom_key" ON "banques"("nom");

-- AddForeignKey
ALTER TABLE "caisses" ADD CONSTRAINT "caisses_succursaleId_fkey" FOREIGN KEY ("succursaleId") REFERENCES "succursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaisseOperation" ADD CONSTRAINT "CaisseOperation_caisseId_fkey" FOREIGN KEY ("caisseId") REFERENCES "caisses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compte" ADD CONSTRAINT "Compte_banqueId_fkey" FOREIGN KEY ("banqueId") REFERENCES "banques"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versements" ADD CONSTRAINT "versements_succursaleId_fkey" FOREIGN KEY ("succursaleId") REFERENCES "succursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versements" ADD CONSTRAINT "versements_compteId_fkey" FOREIGN KEY ("compteId") REFERENCES "Compte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versements" ADD CONSTRAINT "versements_utillisateurId_fkey" FOREIGN KEY ("utillisateurId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
