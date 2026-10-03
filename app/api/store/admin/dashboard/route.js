import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { authAdmin } from "@/middleware/authAdmin";

// get dashboard data for admin (total orders, total earnings, total products)
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ message: "not authorized." }, { status: 401 });
    }

    // get orders count
    const orders = await prisma.order.count();
    // get stores count
    const stores = await prisma.store.count();
    // get all orders include only createdAt and total, and calculate total revenue
    const allOrders = await prisma.order.findMany({
      where: { createdAt: true, total: true },
    });
    let totalRevenue = 0;
    allOrders.forEach((order) => (totalRevenue += order.total));
    const revenue = totalRevenue.toFixed(2);
    // get total products on app
    const products = await prisma.product.count();
    const dashboradData = {
      orders,
      stores,
      products,
      revenue,
      allOrders,
    };

    return NextResponse.json({ dashboradData });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 400 },
    );
  }
}
