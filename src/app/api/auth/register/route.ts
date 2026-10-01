import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  SESSION_COOKIE,
  createSessionToken,
  hashPassword,
  isValidBdPhone,
  isValidEmail,
  normalizeEmail,
  publicUser,
  sessionCookieOptions,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const name = String(body?.name ?? "").trim();
    const email = normalizeEmail(String(body?.email ?? ""));
    const phone = String(body?.phone ?? "").trim();
    const password = String(body?.password ?? "");

    if (name.length < 2) {
      return NextResponse.json(
        { error: "Please tell us your name (at least 2 characters)." },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "That email address doesn't look right." },
        { status: 400 }
      );
    }
    if (phone && !isValidBdPhone(phone)) {
      return NextResponse.json(
        { error: "Phone should be a Bangladeshi mobile number, e.g. 01712345678." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Try signing in instead." },
        { status: 409 }
      );
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash: hashPassword(password),
      },
    });

    const res = NextResponse.json({ user: publicUser(user) }, { status: 201 });
    res.cookies.set(SESSION_COOKIE, createSessionToken(user.id), sessionCookieOptions());
    return res;
  } catch (error) {
    console.error("POST /api/auth/register failed:", error);
    return NextResponse.json(
      { error: "We couldn't create your account. Please try again." },
      { status: 500 }
    );
  }
}
