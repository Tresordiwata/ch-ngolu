import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { montant, description, typeEntreeId } = body;

    const entree = await prisma.entree.update({
      where: {
        id: params.id,
      },
      data: {
        montant,
        description,
        typeEntreeId,
      },
      include: {
        typeEntree: true,
        utilisateur: {
          select: {
            nom: true,
            prenom: true,
          },
        },
      },
    });

    return NextResponse.json(entree);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'entrée:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'entrée' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.entree.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'entrée:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'entrée' },
      { status: 500 }
    );
  }
}