import { authAdmin } from "@/middleware/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  console.log("request reached: ", request);
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);
    console.log("isAdmin: ", isAdmin);
    if (!isAdmin) {
      return NextResponse.json({ message: "not authorized." }, { status: 401 });
    }

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 400 },
    );
  }
}
