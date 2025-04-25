import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(Request) {
  try {
    const liste=await prisma.succursale.findMany({
      where:{
       
      }
    })
    return NextResponse.json(liste, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function POST(Request) {
  const {adresse,code,nom,telephone,email} = await Request.json();

  try {
    const data=await prisma.succursale.create({
        data:{
            adresse:adresse,
            code:code,
            email:email,
            nom:nom,
            telephone:telephone
        }
    })
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({"data":error.toString()}, { status: 501 });
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
