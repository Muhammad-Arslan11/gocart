import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { authSeller } from "@/middleware/authSeller";

// get dashboard data for seller (total orders, total earnings, total products)
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = authSeller(userId);

    if (!storeId) {
      return NextResponse.json(
        { error: "storeId not found." },
        { status: 401 },
      );
    }

    // get all orders
    const orders = await prisma.order.findMany({
      where: { storeId },
    });
    // get all products
    const products = await prisma.store.findMany({
      where: { storeId },
    });
    // get all rating
    const ratings = await prisma.store.findMany({
      where: { ProductId: { in: products.map((product) => product.id) } },
      include: { user: true, product: true },
    });

    const dashboardData = {
      ratings,
      totalOrders: orders.length,
      totalEarnings: Math.round(
        orders.reduce((acc, order) => (acc + order.total, 0)),
      ),
      products: products.length,
    };

    return NextResponse.json({ dashboardData });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 400 },
    );
  }
}
