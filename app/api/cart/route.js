import { prisma } from "@/db";
import { getAuth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// update user cart
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { cart } = await request.json();

    await prisma.user.update({
      where: { id: userId },
      data: { cart: cart },
    });

    return NextResponse.json({ message: "cart updated successfully." });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message | error.code },
      { status: 400 },
    );
  }
}

// get user cart
export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return NextResponse.json({ cart: user.cart });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message | error.code },
      { status: 400 },
    );
  }
}
