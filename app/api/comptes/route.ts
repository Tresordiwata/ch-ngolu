import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(Request: NextRequest) {
  try {
    const comptesListe = await prisma.compte.findMany({
      include: {
        banque: true,
      },
      where: {
        NOT: {
          status: "S",
        },
      },
    });

    return NextResponse.json(comptesListe, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function POST(Request: NextRequest) {
  const { nom, numero, banque, devise } = await Request.json();

  try {
    const newCompte = await prisma.compte.create({
      data: {
        devise: devise,
        numero: numero,
        banqueId: banque,
        nom: nom,
      },
    });

    return NextResponse.json(newCompte, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function PUT(Request: NextRequest) {
  const {} = await Request.json();

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function DELETE(Request: NextRequest) {
  const {} = await Request.json();

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}
