"use server";

import { z } from "zod";
import { requireUser } from "./utils/requireUser";
import { companySchema, jobSeekerSchema } from "./utils/zodSchemas";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";
import arcjet, { detectBot, shield } from "./utils/arcjet";
import { request } from "@arcjet/next";

const aj=arcjet.withRule(
  shield({
    mode:'DRY_RUN'
  })
).withRule(
  detectBot({
    mode:'LIVE',
    allow:[],
  })
)

export async function createCompany(data:z.infer<typeof companySchema>) {
  const session=await requireUser();
  const req = await request()
  const decision=await aj.protect(req)

  if(decision.isDenied()){
    throw new Error('FORBIDDEN');
  }

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

export async function createJobSeeker(data:z.infer<typeof jobSeekerSchema>) {
  const user=await requireUser();
  const req = await request()
  const decision=await aj.protect(req)

  if(decision.isDenied()){
    throw new Error('FORBIDDEN');
  }
  
  const validateData=jobSeekerSchema.parse(data);

  await prisma.user.update({
    where:{
      id:user.id as string
    },
    data:{
      onboradingCompleted:true,
      userType:"JOB_SEEKER",
      JobSeeker:{
        create:{
          ...validateData
        }
      }
    }
  })

  return redirect("/")
}
