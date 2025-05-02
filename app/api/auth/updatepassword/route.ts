import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { IUtilisateur } from "@/lib/types/utilisateur";

export async function GET(Request: NextRequest) {
  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function POST(Request: NextRequest) {
  const { old, newPwd } = await Request.json();

  try {
    const profil = JSON.parse(
      (await cookies()).get("profil")?.value || "",
    ) as IUtilisateur;
    const oldIsCorrect = await prisma.utilisateur.findFirst({
      where: {
        id: profil.id.toString(),
        motDePasse: old,
      },
    });

    if (oldIsCorrect) {
      await prisma.utilisateur.update({
        data: {
          motDePasse: newPwd,
        },
        where: {
          id: profil?.id.toString(),
        },
      });

      return NextResponse.json({ success: true }, { status: 201 });
    } else {
      return NextResponse.json(
        { success: false, msg: "L'ancien mot de passe saisi est incorrect" },
        { status: 201 },
      );
    }
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
