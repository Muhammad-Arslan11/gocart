import { prisma } from "@/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { buffer } from "node:stream/consumers";
import { validEmail } from "@/app/utility";
import { validString } from "@/app/utility";
import { imagekit } from "@/config/imageKit";

//  create the store
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    // get form data
    const formData = await request.formData();

    const name = formData.get("name");
    const username = formData.get("username");
    const description = formData.get("description");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const address = formData.get("address");
    const image = formData.get("image");

    if (
      !validString(name) ||
      !validString(username) ||
      !validString(description) ||
      !validEmail(email) ||
      !validString(contact) ||
      !validString(address)
    ) {
      return NextResponse.json(
        { error: "Missing store data info." },
        { status: 400 },
      );
    }

    // check if store is already registered
    const store = await prisma.store.findFirst({
      where: { userId: userId },
    });
    if (store) {
      return NextResponse.json({ status: store.status });
    }

    // check if username is already taken
    const IsUsernameAleardyTaken = await prisma.store.findFirst({
      where: { username: username.toLowercase() },
    });
    if (IsUsernameAleardyTaken) {
      return NextResponse.json(
        { message: "User is already taken." },
        { status: 400 },
      );
    }

    // upload image to imageKit
    const buffer = buffer.from(await image.arrayBuffer());
    const response = await imagekit.upload({
      file: buffer,
      fileName: image.name,
      folder: "logos",
    });
    const optimizedImage = await imagekit.url({
      file: response.filePath,
      transformation: [{ quality: "auto" }, { format: "webp" }, { width: 512 }],
    });

    // create a new store
    const data = {
      userId,
      name,
      description,
      username: username.toLowercase(),
      email,
      address,
      contact,
      logo: optimizedImage,
    };
    const newStore = await prisma.store.create({
      data,
    });

    // link user to store
    await prisma.user.update({
      where: { id: userId },
      data: { store: { connect: { id: newStore.id } } },
    });

    return NextResponse.json({ message: "Applied, waiting for approval." });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message | error.code },
      { status: 400 },
    );
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    // check if store is already registered
    const store = await prisma.store.findFirst({
      where: { userId: userId },
    });
    if (store) {
      return NextResponse.json({ status: store.status });
    }
    return NextResponse.json({ message: "user not registered" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message | error.code },
      { status: 400 },
    );
  }
}
