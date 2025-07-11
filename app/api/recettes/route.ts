import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

import { convertDate } from "@/app/utils/convertDate";
import { prisma } from "@/lib/prisma";
import { IUtilisateur } from "@/lib/types/utilisateur";

export async function GET(Request: NextRequest) {
  try {
    // ce code marche
    const url = new URLSearchParams(Request.nextUrl.searchParams);
    const limit = url.get("limit");
    // const role = url.get("role");
    // const d = "2025-04-22T10:38:29.309+02:00[Africa/Lubumbashi]";
    // const df = moment(convertDate(d)).format();
    // Fin code
    const getCookies = await cookies();
    const profil = JSON.parse(
      getCookies.get("profil")?.value || "",
    ) as IUtilisateur;
    // const profil = {} as IUtilisateur;
    let recettes: any = [];

    if (profil?.role == "ADMIN_GENERAL") {
      recettes = await prisma.recette.findMany({
        include: {
          utilisateur: true,
          rubrique: true,
        },
        take: Number(limit),
        where: {
          NOT: {
            status: "D",
          },
        },
        orderBy:{
          createdAt:"desc"
        }
      });
    } else {
      recettes = await prisma.recette.findMany({
        include: {
          utilisateur: true,
          rubrique: true,
          succursale:true
        },
        where: {
          succursaleId: profil.succursaleId.toString(),
          NOT: {
            status: "D",
          },
        },
        orderBy:{
          createdAt:"desc"
        },
        take: Number(limit),
      });
    }

    return NextResponse.json(recettes, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function POST(Request: NextRequest) {
  const {
    rubrique,
    devise,
    dt,
    montant,
    utilisateur,
    succursaleId,
  } = await Request.json();

  try {
    const cleanedDate = new Date(convertDate(dt));
    const recetteNew = await prisma.recette.create({
      data: {
        devise: devise,
        succursaleId: succursaleId,
        dateRecette: cleanedDate,
        montant: parseFloat(montant),
        observation: "",
        utilisateurId: utilisateur,
        rubriqueId: Number(rubrique),
        estCloturee:"OL"
      },
      include:{
        rubrique:true,
        succursale:true
      }
    });

    const caisseConcerned = await prisma.caisse.findFirst({
      where: {
        succursaleId: succursaleId,
        devise: devise,
      },
    });

    await prisma.caisse.update({
      data: {
        montant: {
          increment: Number(montant),
        },
      },
      where: {
        id: caisseConcerned?.id,
      },
    });

    return NextResponse.json(recetteNew, { status: 201 });
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
  const { id } = await Request.json();

  try {
    const recette = await prisma.recette.update({
      data: {
        status: "D",
      },
      where: {
        id: id,
      },
    });

    return NextResponse.json(recette, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ erro: error.toString() }, { status: 501 });
  }
}
