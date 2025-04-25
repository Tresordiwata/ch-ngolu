import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const types = await prisma.typeDepenseInterne.findMany({
      orderBy: {
        libelle: 'asc',
      },
    });

    return NextResponse.json(types);
  } catch (error) {
    console.error('Erreur lors de la récupération des types de dépense interne:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des types de dépense interne' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { libelle, description } = body;

    const type = await prisma.typeDepenseInterne.create({
      data: {
        libelle,
        description,
      },
    });

    return NextResponse.json(type);
  } catch (error) {
    console.error('Erreur lors de la création du type de dépense interne:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du type de dépense interne' },
      { status: 500 }
    );
  }
}