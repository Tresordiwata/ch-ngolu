import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const succursaleId = searchParams.get('succursaleId');

    if (!succursaleId) {
      return NextResponse.json(
        { error: 'ID de succursale manquant' },
        { status: 400 }
      );
    }

    const clotures = await prisma.$queryRaw`
      WITH cloture_stats AS (
        SELECT 
          c.id,
          c.date,
          c.utilisateur_id,
          COALESCE(SUM(d.montant) FILTER (WHERE d.created_at <= c.date), 0) as total_depenses,
          COALESCE(SUM(e.montant) FILTER (WHERE e.created_at <= c.date), 0) as total_entrees
        FROM clotures c
        LEFT JOIN depenses d ON d.succursale_id = c.succursale_id AND d.created_at <= c.date
        LEFT JOIN entrees e ON e.succursale_id = c.succursale_id AND e.created_at <= c.date
        WHERE c.succursale_id = ${succursaleId}
        GROUP BY c.id, c.date, c.utilisateur_id
      )
      SELECT 
        cs.id,
        cs.date,
        cs.total_depenses as "totalDepenses",
        cs.total_entrees as "totalEntrees",
        (cs.total_entrees - cs.total_depenses) as solde,
        json_build_object(
          'nom', u.nom,
          'prenom', u.prenom
        ) as utilisateur
      FROM cloture_stats cs
      JOIN utilisateurs u ON u.id = cs.utilisateur_id
      ORDER BY cs.date DESC
    `;

    return NextResponse.json(clotures);
  } catch (error) {
    console.error('Erreur lors de la récupération des clôtures:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des clôtures' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { succursaleId, utilisateurId } = body;

    // Vérifier s'il y a déjà une clôture aujourd'hui
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);

    const clotureExistante = await prisma.cloture.findFirst({
      where: {
        succursaleId,
        date: {
          gte: aujourdhui,
          lt: new Date(aujourdhui.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (clotureExistante) {
      return NextResponse.json(
        { error: 'Une clôture a déjà été effectuée aujourd\'hui' },
        { status: 400 }
      );
    }

    // Créer la clôture
    const cloture = await prisma.cloture.create({
      data: {
        succursaleId,
        utilisateurId,
      },
    });

    // Marquer toutes les opérations non clôturées comme clôturées
    await Promise.all([
      prisma.depense.updateMany({
        where: {
          succursaleId,
          estCloturee: 'N',
          createdAt: {
            lte: new Date(),
          },
        },
        data: {
          estCloturee: 'N',
        },
      }),
      
    ]);

    return NextResponse.json(cloture);
  } catch (error) {
    console.error('Erreur lors de la création de la clôture:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la clôture' },
      { status: 500 }
    );
  }
}