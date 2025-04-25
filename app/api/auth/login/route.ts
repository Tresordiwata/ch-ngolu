/* eslint-disable prettier/prettier */
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(Request: NextRequest) {
  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function POST(Request: NextRequest) {
  const {login,pwd} = await Request.json();
  try {
    const user=await prisma.utilisateur.findUnique({
      where:{
        email:login,
        motDePasse:pwd,
        estActif:true
      },
      omit:{
        motDePasse:true,
        createdAt:true,
        updatedAt:true
      }
    })
    if(user)
    {
      const c=await cookies();
      c.set("profil",JSON.stringify(user),{secure:true,maxAge:3600})
      c.set("connected",true,{secure:true,maxAge:3600})
      return NextResponse.json({connected:true,utilisateur:user,token:user.id}, { status: 201 });
    }else{
      return NextResponse.json({connected:false},{status:201})
    }
  } catch (error) {
    return NextResponse.json({}, { status: 501 });
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
