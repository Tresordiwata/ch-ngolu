import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(Request: NextRequest) {
  try {
    const users=await prisma.utilisateur.findMany({
      where:{
       
      },
      include:{
        succursale:true
      },
      omit:{
        motDePasse:true
      }
    });
    return NextResponse.json(users, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function POST(Request: NextRequest) {
  const {succursale,nom,prenom,login,password} = await Request.json();

  try {
    const newUser=await prisma.utilisateur.create({
      data:{
        email:login,
        motDePasse:password,
        nom:nom,
        prenom:prenom,
        succursaleId:succursale,
      }
    })
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({error:error.toString()}, { status: 501 });
  }
}

export async function PUT(Request: NextRequest) {
  const {} = await Request.json();

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    return NextResponse.json({}, { status: 501 });
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
