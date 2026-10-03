import { NextResponse } from "next/server";
import { prisma } from "@/db";

// toggle stock of a product
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { productId } = request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "missing details: productId" },
        { status: 400 },
      );
    }

    // check if product exists
    const product = await prisma.product.findFirst({
      where: { id: productId, storeId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "product not found." },
        { status: 404 },
      );
    }

    // update
    await prisma.product.update({
      where: { id: productId },
      data: { inStock: !product.inStock },
    });

    return NextResponse.json({ message: "Product stock updated successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 400 },
    );
  }
}
