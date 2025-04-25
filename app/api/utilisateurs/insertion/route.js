import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(Request) {
  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function POST(Request) {

  try {
    const newUs=await prisma.utilisateur.create({
        data:{
            email:"tdl",
            motDePasse:"12345",
            nom:"Tresor Diwata",
            prenom:"Tresor",
            role:"ADMIN_GENERAL",
            estActif:true,

        }
    })
    return NextResponse.json(newUs, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
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
  const {} = await Request.json();

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    return NextResponse.json({}, { status: 501 });
  }
}
