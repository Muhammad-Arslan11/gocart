// pages/api/inngest.ts
import { Inngest } from "inngest";
import { serve } from "inngest/next";

export const inngest = new Inngest({ id: "gocart-store" });

export default serve({
    client: inngest,
    functions: [],
});