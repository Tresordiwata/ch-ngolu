import moment from "moment";
import { NextResponse, NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request, props: any) {
  try {
    const { searchParams } = new URL(request.url);
    const periode = searchParams?.get("periode") || "M";

    const depense = await prisma.depense.findMany({
      where: {
        dateDepense: {
          gte: new Date(moment("2025-04-28").startOf("month").format()),
          lte: new Date(moment("2025-04-28").endOf("month").format()),
        },
      },
    });
    const recettes = await prisma.recette.findMany({
      where: {
        dateRecette: {
          gte: new Date(moment("2025-04-28").startOf("month").format()),
          lte: new Date(moment("2025-04-28").endOf("month").format()),
        },
      },
    });
    const versements = await prisma.versement.findMany({
      where: {
        dateVersement: {
          gte: new Date(moment("2025-04-28").startOf("month").format()),
          lte: new Date(moment("2025-04-28").endOf("month").format()),
        },
      },
    });

    // const getCookies = await cookies();
    // const profil = JSON.parse(getCookies.get("profil")?.value || "") as IUtilisateur;
    // if(profil?.role==="ADMIN_GENERAL")
    // {

    // }

    return NextResponse.json(
      { depenses: depense, recettes: recettes, versements: versements },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function POST(Request: NextRequest) {
  const {} = await Request.json();

  try {
    return NextResponse.json({}, { status: 201 });
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
