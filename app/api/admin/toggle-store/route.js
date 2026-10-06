import { prisma } from "@/db";
import { authAdmin } from "@/middleware/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// get all approved stores
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ message: "not authorized." }, { status: 401 });
    }
    const { storeId } = await request.json();
    if (!storeId) {
      return NextResponse.json(
        { message: "missing storeId." },
        { status: 400 },
      );
    }
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!store) {
      return NextResponse.json(
        { message: "store not found." },
        { status: 400 },
      );
    }
    // update or toggle store status
    await prisma.store.update({
      where: { id: storeId },
      data: { isActive: !store.isActive },
    });
    return NextResponse.json({ store });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 400 },
    );
  }
}
