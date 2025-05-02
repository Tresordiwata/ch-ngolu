import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { IUtilisateur } from "@/lib/types/utilisateur";

export async function GET(Request: NextRequest) {
  try {
    const profil = JSON.parse(
      (await cookies()).get("profil")?.value || "",
    ) as IUtilisateur;
    let users = {} as any;

    if (profil?.role === "ADMIN_GENERAL") {
      users = await prisma.utilisateur.findMany({
        where: {
          NOT:{
            Status:"D"
          }
        },
        include: {
          succursale: true,
        },
        omit: {
          motDePasse: true,
        },
      });
    } else {
      users = await prisma.utilisateur.findMany({
        where: {
          NOT:{
            Status:"D"
          },
          succursaleId: profil.succursaleId.toString(),
        },
        include: {
          succursale: true,
        },
        omit: {
          motDePasse: true,
        },
      });
    }

    return NextResponse.json(users, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function POST(Request: NextRequest) {
  const { succursale, nom, role, prenom, login, password } =
    await Request.json();

  try {
    const newUser = await prisma.utilisateur.create({
      data: {
        email: login,
        motDePasse: password,
        nom: nom,
        prenom: prenom,
        succursaleId: succursale,
        role: role,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
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
