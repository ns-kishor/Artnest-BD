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

    let user: { id: string; name: string; email: string; phone: string | null; createdAt: Date | string };
    try {
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json(
          { error: "An account with this email already exists. Try signing in instead." },
          { status: 409 }
        );
      }

      user = await db.user.create({
        data: {
          name,
          email,
          phone: phone || null,
          passwordHash: hashPassword(password),
        },
      });
    } catch (dbErr) {
      console.warn("Database unavailable, falling back to in-memory demo user:", dbErr);
      const { findMockUserByEmail, createMockUser } = await import("@/lib/mock-db");
      const existingMock = findMockUserByEmail(email);
      if (existingMock) {
        return NextResponse.json(
          { error: "An account with this email already exists. Try signing in instead." },
          { status: 409 }
        );
      }
      user = createMockUser({
        name,
        email,
        phone: phone || null,
        passwordHash: hashPassword(password),
      });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
    };

    const res = NextResponse.json({ user: userData }, { status: 201 });
    res.cookies.set(SESSION_COOKIE, createSessionToken(userData), sessionCookieOptions());
    return res;
  } catch (error) {
    console.error("POST /api/auth/register failed:", error);
    return NextResponse.json(
      { error: "We couldn't create your account. Please try again." },
      { status: 500 }
    );
  }
}
