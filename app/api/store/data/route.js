import { NextResponse } from "next/server";
import { prisma } from "@/db";

// get store info and store products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username").toLowerCase();

    if (!username) {
      return NextResponse.json(
        { error: "username not found." },
        { status: 401 },
      );
    }

    // get store info and inStock product with rating
    const store = await prisma.store.findUnique({
      where: { username, isActive: true },
      include: { Product: { include: { rating: true } } },
    });

    if (!store) {
      return NextResponse.json({ error: "store not found." }, { status: 401 });
    }

    return NextResponse.json({ store });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message | error.code },
      { status: 400 },
    );
  }
}
