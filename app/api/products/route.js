import { prisma } from "@/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    let products = await prisma.product.findMany({
      where: { inStock: true },
      include: {
        rating: {
          select: {
            createdAt: true,
            rating: true,
            review: true,
            user: { select: { name: true, image: true } },
          },
        },
        store: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // remove property with store isActive false
    products = products.filter((product) => product.store.isActive);
    return NextResponse.json({ products });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message | error.code },
      { status: 400 },
    );
  }
}
