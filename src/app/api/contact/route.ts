import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const contact = String(body?.contact ?? "").trim();
    const subject = String(body?.subject ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (name.length < 2) {
      return NextResponse.json({ error: "Please tell us your name." }, { status: 400 });
    }
    if (contact.length < 5) {
      return NextResponse.json(
        { error: "Please provide a phone number or email so we can reply." },
        { status: 400 }
      );
    }
    if (subject.length < 2) {
      return NextResponse.json({ error: "Please add a subject." }, { status: 400 });
    }
    if (message.length < 10) {
      return NextResponse.json(
        { error: "Please write a slightly longer message (at least 10 characters)." },
        { status: 400 }
      );
    }

    await db.contactMessage.create({
      data: { name, contact, subject, message },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/contact failed:", error);
    return NextResponse.json(
      { error: "Could not send your message right now. Please try again." },
      { status: 500 }
    );
  }
}
