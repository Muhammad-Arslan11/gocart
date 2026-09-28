import { serve } from "inngest/next";
import { inngest } from "../inngest";
import { syncUserDelete, syncUserUpdate, syncUserCreation } from "./function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserUpdate, syncUserDelete],
});
