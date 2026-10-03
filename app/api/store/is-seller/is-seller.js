import { authSeller } from "@/middleware/authSeller";
import { NextResponse } from "next/server";
import { prisma } from "@/db";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ error: "not authorized." }, { status: 401 });
    }

    // get store data
    const storeData = await prisma.store.findUnique({
      where: { userId },
    });

    return NextResponse.json({ isSeller, storeData });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 400 },
    );
  }
}
