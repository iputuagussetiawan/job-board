import { inngest } from "@/app/utils/inngest/client";
import { handleJobExpiration } from "@/app/utils/inngest/functions";
import { serve } from "inngest/next";
import { helloWorld } from "./functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld, handleJobExpiration
  ],
});
