import { authSeller } from "@/middleware/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { validString } from "@/app/utility";
import { imagekit } from "@config/ImageKit";
import { prisma } from "@/db";

// add new product
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ message: "not authorized" }, { status: 401 });
    }

    // get form data
    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = Number(formData.get("mrp"));
    const price = Number(formData.get("price"));
    const category = formData.get("category");
    const image = formData.getAll("image");

    if (!validString(name) || !validString(description) || image.length < 1) {
      return NextResponse.json(
        { error: "Missing store data info." },
        { status: 400 },
      );
    }

    // upload images to imagekit
    const imagesUrl = await Promise.all(async (image) => {
      const buffer = Buffer.from(await image.arrayBuffer());
      const response = await imagekit.upload({
        file: buffer,
        fileName: image.name,
        folder: "products",
      });
      const url = await imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: 512 },
        ],
      });
      return url;
    });

    // upload data to the database
    await prisma.product.create({
      data: {
        storeId,
        name,
        description,
        mrp,
        price,
        category,
        images: imagesUrl,
      },
    });

    return NextResponse.json({ message: "Product added successfully." });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message | error.code },
      { status: 400 },
    );
  }
}

// get products
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ message: "not authorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({ where: { storeId } });
    return NextResponse.json({ products });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message | error.code },
      { status: 400 },
    );
  }
}
