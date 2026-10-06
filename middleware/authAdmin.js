import { clerkClient } from "@clerk/nextjs/server";

export const authAdmin = async (userId) => {
  try {
    if (!userId) {
      return false;
    }
    const client = await clerkClient();
    console.log("client: ", client);
    const user = await client.users.getUser(userId);
    const splitArray = process.env.ADMIN_EMAIL.split(",");
    const admin_email = splitArray.includes(
      user.emailAddresses[0].emailAddress,
    );
    const userEmail = process.env.ADMIN_EMAIL.split(",").includes(
      user.emailAddresses[0].emailAddress,
    );
    console.log("splitArray:", splitArray, "admin_email:", admin_email);
    console.log(user.emailAddresses[0].emailAddress === splitArray[0]);
    return userEmail;
  } catch (error) {
    console.log(error);
    return false;
  }
};
