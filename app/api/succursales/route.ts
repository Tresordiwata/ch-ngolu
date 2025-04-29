import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { IUtilisateur } from "@/lib/types/utilisateur";

export async function GET() {
  try {
    const profil = JSON.parse(
      (await cookies()).get("profil")?.value || ""
    ) as IUtilisateur;
    let liste: any = [];
    if (profil?.role === "ADMIN_GENERAL") {
      liste = await prisma.succursale.findMany({
        where: {
          NOT: {
            Status: "D",
          },
        },
      });
    } else {
      liste = await prisma.succursale.findMany({
        where: {
          id: profil?.succursaleId.toString(),
          NOT: {
            Status: "D",
          },
        },
      });
    }

    return NextResponse.json(liste, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function POST(Request: NextRequest) {
  const { adresse, code, nom, telephone, email } = await Request.json();

  try {
    const data = await prisma.succursale.create({
      data: {
        adresse: adresse,
        code: code,
        email: email,
        nom: nom,
        telephone: telephone,
      },
    });

    await prisma.caisse.createMany({
      data: [
        {
          devise: "CDF",
          succursaleId: data.id,
          montant: 0,
        },
        {
          devise: "USD",
          succursaleId: data.id,
          montant: 0,
        },
      ],
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ data: error.toString() }, { status: 501 });
  }
}

export async function PUT(Request: Request) {
  const {} = await Request.json();

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    return NextResponse.json({}, { status: 501 });
  }
}

export async function DELETE(Request: Request) {
  const {} = await Request.json();

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    return NextResponse.json({}, { status: 501 });
  }
}
