import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { publicUser, verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = verifySession(req.cookies.get("artnest_session")?.value);
    if (!session) {
      return NextResponse.json({ user: null });
    }

    if (session.user) {
      return NextResponse.json({ user: session.user });
    }

    try {
      const user = await db.user.findUnique({ where: { id: session.userId } });
      if (user) {
        return NextResponse.json({ user: publicUser(user) });
      }
    } catch (dbErr) {
      console.warn("Database lookup failed in /api/auth/me, checking mock users:", dbErr);
    }

    const { findMockUserById } = await import("@/lib/mock-db");
    const mockUser = findMockUserById(session.userId);
    if (mockUser) {
      return NextResponse.json({
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          phone: mockUser.phone,
          createdAt: mockUser.createdAt instanceof Date ? mockUser.createdAt.toISOString() : String(mockUser.createdAt),
        },
      });
    }

    return NextResponse.json({ user: null });
  } catch (error) {
    console.error("GET /api/auth/me failed:", error);
    return NextResponse.json({ user: null });
  }
}
