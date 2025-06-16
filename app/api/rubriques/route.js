import { prisma } from "@/lib/prisma"; 
import { NextResponse, NextRequest } from "next/server";

export async function GET(Request) {
  try {
    const rubriques=await prisma.rubrique.findMany({
      where:{
        NOT:{
          Status:"D"
        }
      },orderBy:{
        libelle:"asc"
      }
    })
    return NextResponse.json(rubriques, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function POST(Request) {
  const {typeRubrique,libelle} = await Request.json();

  try {
    const donnees=await prisma.rubrique.create({
      data:{
        libelle:libelle,
        typeRubr:typeRubrique
      }
    })
    return NextResponse.json(donnees, { status: 201 });
  } catch (error) {
    return NextResponse.json({error:error.toString()}, { status: 501 });
  }
}

export async function PUT(Request) {
  const {} = await Request.json();

  try {

    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    return NextResponse.json({}, { status: 501 });
  }
}

export async function DELETE(Request) {
  const {id} = await Request.json();

  try {
    const req=await prisma.rubrique.update({
      data:{
        Status:'D'
      },
      where:{
        id:id
      }
    })
    return NextResponse.json({data:id}, { status: 201 });
  } catch (error) {
    return NextResponse.json({}, { status: 501 });
  }
}
