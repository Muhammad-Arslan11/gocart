import { prisma } from "@/db";

// this function is responsible to check user in the db
export const authUser = async (user) => {
  try {
    const user = prisma.user.findUnique({
      where: { id: user.id },
    });
    console.log("user: ", user);
    return user;
  } catch (error) {
    console.log(error);
    return false;
  }
};
