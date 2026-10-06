import { couponDummyData } from "@/assets/assets";
import { prisma } from "@/db";
import { authAdmin } from "@/middleware/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// get coupon
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ message: "not authorized." }, { status: 401 });
    }
    const { coupon } = await request.json();
    coupon.code = coupon.code.toUpperCase();
    await prisma.coupon.create({ data: coupon });
    return NextResponse.json({ message: "coupon added successfully." });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 400 },
    );
  }
}

// Delete coupon. /api/coupon/id?=coupondId
export async function DELETE(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ message: "not authorized." }, { status: 401 });
    }
    const { searchParams } = request.nextUrl;
    const code = searchParams.get("code");
    await prisma.coupon.delete({ code }).then(async (coupon) => {
      // run inngest scheduler function to delete coupon on expiry
      inngest.send({
        name: "app/coupon.expired",
        data: {
          code: coupon.code,
          expires_at: coupon.expiresAt,
        },
      });
    });

    return NextResponse.json({ message: "coupon deleted successfully." });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 400 },
    );
  }
}

// get all coupons
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ message: "not authorized." }, { status: 401 });
    }
    const allCoupons = await prisma.coupon.findMany({});

    return NextResponse.json({ allCoupons });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 400 },
    );
  }
}
