import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(2, { message: "Company name must at least 2 character" }),
  location: z.string().min(1, { message: "Location must be defined" }), 
  about: z.string().min(10, { message: "Please describe your company" }),
  logo: z.string().min(1, { message: "Please upload a logo" }),
  website: z.string().url( { message: "Please enter a valid URL" }),
  xAccount: z.string().optional(),
})