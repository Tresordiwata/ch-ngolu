import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(Request: NextRequest, { params }: { params: any }) {
  try {
    const id = await params?.id;
    const findRecette = await prisma.recette.findUnique({
      where: {
        id: id,
      },
      include: {
        rubrique: true,
        succursale: true,
        utilisateur: true,
      },
    });

    return NextResponse.json(findRecette, { status: 201 });
  } catch (error) {
    return NextResponse.json({}, { status: 501 });
  }
}
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { action } = body;
    let entree = {};

    if (action === "cloture") {
      entree = await prisma.recette.update({
        data: {
          estCloturee: "OL",
        },
        where: {
          id: params.id,
        },
      });
    }

    return NextResponse.json(entree);
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.recette.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'entrée:", error);

    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'entrée" },
      { status: 500 },
    );
  }
}
