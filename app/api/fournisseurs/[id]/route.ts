import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { nom, email, telephone, adresse, rccm } = body;

    const fournisseur = await prisma.fournisseur.update({
      where: {
        id: params.id,
      },
      data: {
        nom,
        email,
        telephone,
        adresse,
        rccm,
      },
    });

    return NextResponse.json(fournisseur);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du fournisseur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du fournisseur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.fournisseur.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erreur lors de la suppression du fournisseur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du fournisseur' },
      { status: 500 }
    );
  }
}