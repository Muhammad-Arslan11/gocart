import { prisma } from "@/db";

// this function is responsible to create user in the db
export const createUser = async (user) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        id: user.id,
        name: user.username,
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
        cart: {},
      },
    });
    console.log("newUser: ", newUser);
    return newUser;
  } catch (error) {
    console.log(error);
    return false;
  }
};
