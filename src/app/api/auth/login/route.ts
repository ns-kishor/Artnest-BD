import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  SESSION_COOKIE,
  createSessionToken,
  normalizeEmail,
  publicUser,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email = normalizeEmail(String(body?.email ?? ""));
    const password = String(body?.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter your email and password." },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "Incorrect email or password. Please try again." },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ user: publicUser(user) });
    res.cookies.set(SESSION_COOKIE, createSessionToken(user.id), sessionCookieOptions());
    return res;
  } catch (error) {
    console.error("POST /api/auth/login failed:", error);
    return NextResponse.json(
      { error: "We couldn't sign you in. Please try again." },
      { status: 500 }
    );
  }
}
