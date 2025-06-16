import getRangeOfDates from "@/app/utils/getRangeOfDate";
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(Request: NextRequest) {
  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function POST(Request: NextRequest) {
  const { dateEnd, dateFrom, devise, succursale } = await Request.json();
  const periode = getRangeOfDates(dateFrom, dateEnd);
  let newData: any[] = [];

  const depenses = await prisma.depense.findMany({
    where: {
      dateDepense: {
        gte: new Date(dateFrom),
        lte: new Date(dateEnd),
      },
      AND: {
        devise: devise,
        succursaleId: succursale,
      },
    },
    include:{
      rubrique:true
    }
  });
  const recettes = await prisma.recette.findMany({
    where: {
      dateRecette: {
        gte: new Date(dateFrom),
        lte: new Date(dateEnd),
      },
      AND: {
        devise: devise,
        succursaleId: succursale,
      },
    },
    include:{
      rubrique:true
    }
  });

  // const rubriques=await prisma.rubrique.findMany({
  //     where:
  //     {
  //         NOT:{
  //         Status:"S"
  //         }
  //     }
  // })

  try {
    return NextResponse.json(
      { depenses: depenses, recettes: recettes, alldates: periode },
      { status: 201 }
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
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}
