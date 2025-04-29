import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function GET(Request: NextRequest) {
  try {
    const Cookies = await cookies();

    Cookies.delete("profil");

    return NextResponse.json({"deconnected":true}, { status: 201 });
  } catch (error:any) {
    return NextResponse.json({ error: error?.toString() }, { status: 501 });
  }
}

export async function POST(Request: NextRequest) {
  const {} = await Request.json();

  try {
    return NextResponse.json({}, { status: 201 });
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
