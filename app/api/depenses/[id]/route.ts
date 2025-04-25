import { NextResponse, NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { IUtilisateur } from "@/lib/types/utilisateur";

export async function GET(Request: NextRequest, { params }: { params: any }) {
  try {
    const id: string = await params.id;
    const depense = await prisma.depense.findUnique({
      where: {
        id: id.toString(),
      },
      include:{
        fournisseur:true,
        rubrique:true,
        succursale:true,
        utilisateur:true
      }
    });

    return NextResponse.json(depense, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function POST(Request: NextRequest,{params}:{params:any}) {
  const {} = await Request.json();

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    return NextResponse.json({}, { status: 501 });
  }
}

export async function PUT(Request: NextRequest,{params}:{params:any}) {
  const {action} = await Request.json();
  const id: string = await params.id;
  const Cookies=await cookies()
  const profil=JSON.parse(Cookies.get("profil")?.value || "") as IUtilisateur

  try {
    const typeCloture=profil.role==="ADMIN_GENERAL"?"OG":"OL";
    const updatedData=await prisma.depense.update({
      data:{
        estCloturee:typeCloture
      },
      where:{
        id:id
      }
    })
    return NextResponse.json(updatedData, { status: 201 });
  } catch (error:any) {
    return NextResponse.json({error:error.toString()}, { status: 501 });
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
