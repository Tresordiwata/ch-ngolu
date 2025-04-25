/*
  Warnings:

  - You are about to drop the `Recette` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Recette" DROP CONSTRAINT "Recette_rubriqueId_fkey";

-- DropForeignKey
ALTER TABLE "Recette" DROP CONSTRAINT "Recette_succursaleId_fkey";

-- DropForeignKey
ALTER TABLE "Recette" DROP CONSTRAINT "Recette_utilisateurId_fkey";

-- DropTable
DROP TABLE "Recette";

-- CreateTable
CREATE TABLE "recettes" (
    "id" SERIAL NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "devise" TEXT NOT NULL,
    "dateRecette" TIMESTAMP(3) NOT NULL,
    "rubriqueId" INTEGER NOT NULL,
    "succursaleId" TEXT NOT NULL,
    "estCloturee" "ClotureStatus" NOT NULL DEFAULT 'N',
    "utilisateurId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "observation" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'A',

    CONSTRAINT "recettes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recettes" ADD CONSTRAINT "recettes_rubriqueId_fkey" FOREIGN KEY ("rubriqueId") REFERENCES "Rubrique"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recettes" ADD CONSTRAINT "recettes_succursaleId_fkey" FOREIGN KEY ("succursaleId") REFERENCES "succursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recettes" ADD CONSTRAINT "recettes_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
