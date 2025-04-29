import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { IUtilisateur } from "@/lib/types/utilisateur";

export async function GET() {
  try {
    const profil = JSON.parse(
      (await cookies()).get("profil")?.value || "",
    ) as IUtilisateur;
    let versements;

    if (profil?.role === "ADMIN_GENERAL") {
      versements = await prisma.versement.findMany({
        include: {
          compte: true,
        },
        orderBy: {
          dateVersement: "desc",
        },
      });
    } else {
      versements = await prisma.versement.findMany({
        include: {
          compte: true,
        },
        where: {
          succursaleId: profil?.succursaleId.toString(),
        },
        orderBy: {
          dateVersement: "desc",
        },
      });
    }

    return NextResponse.json(versements, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function POST(Request: NextRequest) {
  const { utilisateurId, succursaleId, compte, montant } = await Request.json();

  try {
    const compteDetail = await prisma.compte.findUnique({
      where: {
        id: compte,
      },
    });
    const newVersement = await prisma.versement.create({
      data: {
        montant: Number(montant),
        compteId: compte,
        succursaleId: succursaleId,
        utillisateurId: utilisateurId,
        estCloture: "N",
      },
    });

    const caisseConcerned = await prisma.caisse.findFirst({
      where: {
        devise: compteDetail?.devise,
        succursaleId: succursaleId,
      },
    });

    const caisseVerse = await prisma.caisse.update({
      data: {
        montant: {
          decrement: Number(montant),
        },
      },
      where: {
        id: caisseConcerned?.id,
      },
    });

    const statutcompte=await prisma.compte.update({
      data: {
        solde: {
          increment: Number(montant),
        },
      },
      where: {
        id: compte,
      },
    });

    return NextResponse.json(
      { versement: newVersement, caisse: caisseVerse,statutcompte:statutcompte },
      { status: 201 },
    );
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
  } catch (error) {
    return NextResponse.json({}, { status: 501 });
  }
}
