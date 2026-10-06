import { authSeller } from "@/middleware/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/db";

// update seller order status
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ message: "not authorized" }, { status: 401 });
    }

    const { orderId, status } = await request.json();

    // upload data to the database
    await prisma.order.update({
      where: { orderId, storeId },
      data: { status },
    });

    return NextResponse.json({ message: "Order status updated." });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 400 },
    );
  }
}

// get all orders for a seller
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ message: "not authorized" }, { status: 401 });
    }
    const { orderId, status } = await request.json();
    const orders = await prisma.order.findMany({
      where: { orderId },
      include: {
        user: true,
        address: true,
        OrderItem: { include: { product: true } },
        orderBy: { createdAt: "desc" },
      },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message | error.code },
      { status: 400 },
    );
  }
}
