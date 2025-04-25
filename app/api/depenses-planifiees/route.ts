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

    const depensesPlanifiees = await prisma.depensePlanifiee.findMany({
      where: {
        succursaleId,
      },
      orderBy: {
        jourDuMois: 'asc',
      },
    });

    return NextResponse.json(depensesPlanifiees);
  } catch (error) {
    console.error('Erreur lors de la récupération des dépenses planifiées:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des dépenses planifiées' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { montant, description, jourDuMois, succursaleId } = body;

    const depensePlanifiee = await prisma.depensePlanifiee.create({
      data: {
        montant,
        description,
        jourDuMois,
        succursaleId,
      },
    });

    return NextResponse.json(depensePlanifiee);
  } catch (error) {
    console.error('Erreur lors de la création de la dépense planifiée:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la dépense planifiée' },
      { status: 500 }
    );
  }
}