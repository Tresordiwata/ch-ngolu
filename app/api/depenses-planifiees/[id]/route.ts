import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { montant, description, jourDuMois } = body;

    const depensePlanifiee = await prisma.depensePlanifiee.update({
      where: {
        id: params.id,
      },
      data: {
        montant,
        description,
        jourDuMois,
      },
    });

    return NextResponse.json(depensePlanifiee);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la dépense planifiée:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la dépense planifiée' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.depensePlanifiee.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erreur lors de la suppression de la dépense planifiée:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la dépense planifiée' },
      { status: 500 }
    );
  }
}