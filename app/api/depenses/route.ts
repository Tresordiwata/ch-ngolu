import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

import { convertDate } from "@/app/utils/convertDate";
import { prisma } from "@/lib/prisma";
import { IUtilisateur } from "@/lib/types/utilisateur";
import { IDepense } from "@/lib/types/depense";

export async function GET(Request: NextRequest) {
  try {
    // ce code marche
    const url = new URLSearchParams(Request.nextUrl.searchParams);
    const limit = url.get("limit");
    // const role = url.get("role");
    // const d = "2025-04-22T10:38:29.309+02:00[Africa/Lubumbashi]";
    // const df = moment(convertDate(d)).format();
    // Fin code
    const getCookies = await cookies();
    const profil = JSON.parse(getCookies.get("profil")?.value || "") as IUtilisateur;
    // const profil = {} as IUtilisateur;
    let depenses:any = [];

    if (profil?.role == "ADMIN_GENERAL") {
      depenses = await prisma.depense.findMany({
        include: {
          utilisateur: true,
          rubrique:true
        },
        take: Number(limit),
        where:{
          NOT:{
            status:"D"
          }
        }
      });
    } else {
      depenses = await prisma.depense.findMany({
        include: {
          utilisateur: true,
          rubrique:true
        },
        where: {
          succursaleId: profil.succursaleId.toString(),
          NOT:{
            status:"D"
          }
        },
        take: Number(limit),
      });
    }

    return NextResponse.json(depenses, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 501 });
  }
}

export async function POST(Request: NextRequest) {
  const {
    beneficiaire,
    rubrique,
    description,
    devise,
    dt,
    fournisseurId,
    montant,
    utilisateur,
    succursaleId,
  } = await Request.json();

  try {
    const cleanedDate = new Date(convertDate(dt));
    const depenseNew = await prisma.depense.create({
      data: {
        devise: devise,
        beneficiaire: beneficiaire,
        succursaleId: succursaleId,
        dateDepense: cleanedDate,
        montant: parseFloat(montant),
        description: description,
        fournisseurId: null,
        utilisateurId: utilisateur,
        rubriqueId: Number(rubrique),
      },
    });

    const caisseConcerned=await prisma.caisse.findFirst({
      where:{
        succursaleId:succursaleId,
        devise:devise
      }
    })

    if(devise=="CDF")
    {
      await prisma.caisse.upsert({
        update:{
          montant:{
            decrement:Number(montant)
          }
        },
        create:{
          succursaleId:succursaleId,
          montant:Number(montant),
          devise:"CDF"
        },
        where:{
          id:caisseConcerned?.id
        }
      })
      await prisma.caisse.upsert({
        update:{
          montant:{
            decrement:0
          }
        },
        create:{
          succursaleId:succursaleId,
          montant:0,
          devise:"USD"
        },
        where:{
          id:caisseConcerned?.id
        }
      })
    }else
    {
      await prisma.caisse.upsert({
        update:{
          montant:{
            decrement:Number(montant)
          }
        },
        create:{
          succursaleId:succursaleId,
          montant:Number(montant),
          devise:"USD"
        },
        where:{
          id:caisseConcerned?.id
        }
      })
      await prisma.caisse.upsert({
        update:{
          montant:{
            decrement:0
          }
        },
        create:{
          succursaleId:succursaleId,
          montant:0,
          devise:"CDF"
        },
        where:{
          id:caisseConcerned?.id
        }
      })
    }
    
   
    
    return NextResponse.json(depenseNew, { status: 201 });
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
  const {id} = await Request.json();

  try {
     
    return NextResponse.json({id:id}, { status: 201 });
  } catch (error) {
    return NextResponse.json({}, { status: 501 });
  }
}
