import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { publicUser, verifySessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = verifySessionToken(req.cookies.get("artnest_session")?.value);
    if (!userId) {
      return NextResponse.json({ user: null });
    }
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({ user: publicUser(user) });
  } catch (error) {
    console.error("GET /api/auth/me failed:", error);
    return NextResponse.json({ user: null });
  }
}
