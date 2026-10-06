import { prisma } from "@/db";
import { getAuth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// get user address
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const { address } = await request.json();
    address.userId = userId;

    const newAddress = await prisma.address.create({
      data: address,
    });
    return NextResponse.json({
      newAddress,
      message: "address added successfully.",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message | error.code },
      { status: 400 },
    );
  }
}
// get all address for a user
export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const addresses = await prisma.address.findMany({
      where: { userId },
    });
    return NextResponse.json({
      addresses,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message | error.code },
      { status: 400 },
    );
  }
}
