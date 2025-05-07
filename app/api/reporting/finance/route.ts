import { NextResponse, NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import getRangeOfDates from "@/app/utils/getRangeOfDate";

export async function GET(Request: NextRequest) {
  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}
async function l(dt: any, devise: string) {
  // Étape 1 : récupérer toutes les rubriques
  const rubriques = await prisma.rubrique.findMany({
    select: {
      id: true,
      libelle: true,
    },
  });

  // Étape 2 : récupérer les dépenses groupées par rubrique, filtrées par date
  const depensesGroupées = await prisma.depense.groupBy({
    by: ["rubriqueId"],
    where: {
      dateDepense: new Date(dt),
    },
    _sum: {
      montant: true,
    },
  });

  // Étape 3 : combiner les deux pour avoir 0 où il n'y a pas de dépenses
  const resultats = rubriques.map((rubrique) => {
    const depense = depensesGroupées.find((d) => d.rubriqueId === rubrique.id);

    return {
      ...rubrique,
      totalDepense: depense?._sum.montant ?? 0,
    };
  });

  return resultats;
}

let datas: any[] = [];

export async function POST(Request: NextRequest) {
  const { dateEnd, dateFrom, devise, succursale, typeRubrique } =
    await Request.json();
  const jours = getRangeOfDates(dateFrom, dateEnd);
  // CHATGPT
  const dateDebut = new Date(`${dateFrom}`);
  const dateFin = new Date(`${dateEnd}`);

  const rubriques = await prisma.rubrique.findMany({
    select: { id: true, libelle: true },
  });
  let resultats:any[]=[]
  for(const dt of getRangeOfDates(dateFrom,dateEnd))
  {
    resultats.push(dt)
  }

  // FIN CHATGPT
  try {
    return NextResponse.json({resultat:"12"}, { status: 201 });
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
