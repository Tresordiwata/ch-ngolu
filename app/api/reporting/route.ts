import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const succursaleId = searchParams.get('succursaleId');
    const dateDebut = searchParams.get('dateDebut');
    const dateFin = searchParams.get('dateFin');

    if (!succursaleId || !dateDebut || !dateFin) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    const [depenses, entrees, depensesParType, entreesParType, evolutionSolde] = await Promise.all([
      // Total des dépenses
      prisma.depense.aggregate({
        where: {
          succursaleId,
          createdAt: {
            gte: new Date(dateDebut),
            lte: new Date(dateFin),
          },
        },
        _sum: {
          montant: true,
        },
      }),

      // Total des entrées
      prisma.entree.aggregate({
        where: {
          succursaleId,
          createdAt: {
            gte: new Date(dateDebut),
            lte: new Date(dateFin),
          },
        },
        _sum: {
          montant: true,
        },
      }),

      // Dépenses par type
      prisma.$queryRaw`
        SELECT 
          COALESCE(tdi.libelle, tde.libelle) as type,
          SUM(d.montant) as montant
        FROM depenses d
        LEFT JOIN types_depense_interne tdi ON d.type_depense_interne_id = tdi.id
        LEFT JOIN types_depense_externe tde ON d.type_depense_externe_id = tde.id
        WHERE d.succursale_id = ${succursaleId}
        AND d.created_at BETWEEN ${dateDebut}::date AND ${dateFin}::date
        GROUP BY COALESCE(tdi.libelle, tde.libelle)
      `,

      // Entrées par type
      prisma.$queryRaw`
        SELECT 
          te.libelle as type,
          SUM(e.montant) as montant
        FROM entrees e
        JOIN types_entree te ON e.type_entree_id = te.id
        WHERE e.succursale_id = ${succursaleId}
        AND e.created_at BETWEEN ${dateDebut}::date AND ${dateFin}::date
        GROUP BY te.libelle
      `,

      // Évolution du solde
      prisma.$queryRaw`
        WITH dates AS (
          SELECT generate_series(
            ${dateDebut}::date,
            ${dateFin}::date,
            '1 day'::interval
          )::date as date
        ),
        depenses_par_jour AS (
          SELECT 
            date(created_at) as date,
            SUM(montant) as montant
          FROM depenses
          WHERE succursale_id = ${succursaleId}
          AND created_at BETWEEN ${dateDebut}::date AND ${dateFin}::date
          GROUP BY date(created_at)
        ),
        entrees_par_jour AS (
          SELECT 
            date(created_at) as date,
            SUM(montant) as montant
          FROM entrees
          WHERE succursale_id = ${succursaleId}
          AND created_at BETWEEN ${dateDebut}::date AND ${dateFin}::date
          GROUP BY date(created_at)
        )
        SELECT 
          d.date::text,
          COALESCE(SUM(e.montant) OVER (ORDER BY d.date), 0) - 
          COALESCE(SUM(dp.montant) OVER (ORDER BY d.date), 0) as solde,
          COALESCE(dp.montant, 0) as depenses,
          COALESCE(e.montant, 0) as entrees
        FROM dates d
        LEFT JOIN depenses_par_jour dp ON d.date = dp.date
        LEFT JOIN entrees_par_jour e ON d.date = e.date
        ORDER BY d.date
      `,
    ]);

    const totalDepenses = depenses._sum.montant || 0;
    const totalEntrees = entrees._sum.montant || 0;

    return NextResponse.json({
      totalDepenses,
      totalEntrees,
      solde: totalEntrees - totalDepenses,
      depensesParType,
      entreesParType,
      evolutionSolde: evolutionSolde.map((jour: any) => ({
        date: jour.date,
        solde: jour.solde,
      })),
      operationsParJour: evolutionSolde.map((jour: any) => ({
        date: jour.date,
        depenses: jour.depenses,
        entrees: jour.entrees,
      })),
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}