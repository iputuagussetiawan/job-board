"use server";

import { z } from "zod";
import { requireUser } from "./utils/requireUser";
import { companySchema } from "./utils/zodSchemas";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";

export async function createCompany(data:z.infer<typeof companySchema>) {
  const session=await requireUser();

  const validateData=companySchema.parse(data);
  
  await prisma.user.update({
    where:{
      id:session.id
    },
    data:{
      onboradingCompleted:true,
      userType:"COMPANY",
      Company:{
        create:{
          // about:validateData.about,
          // location:validateData.location,
          // logo:validateData.logo,
          // name:validateData.name,
          // website:validateData.website

          //alternative from code above
          ...validateData
        }
      }
    }
  });
  return redirect("/");
}
