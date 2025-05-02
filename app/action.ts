"use server";

import { z } from "zod";
import { requireUser } from "./utils/requireUser";
import { companySchema, jobSchema, jobSeekerSchema } from "./utils/zodSchemas";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";
import arcjet, { detectBot, shield } from "./utils/arcjet";
import { request } from "@arcjet/next";
import { stripe } from "./utils/stripe";
import { jobListingDurationPricing } from "./utils/pricingTiers";

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

export async function createJob(data: z.infer<typeof jobSchema>) {
  const user = await requireUser();
  const req = await request();
  const decision=await aj.protect(req);

  if(decision.isDenied()){
    throw new Error('FORBIDDEN');
  }

  const validateData = jobSchema.parse(data);
  const company=await prisma.company.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      user:{
        select:{
          stripeCustomerId:true
        }
      }
    },
  });

  if(!company?.id){
    return redirect("/");
  }

  let stripeCustomerId=company.user.stripeCustomerId;

  if(!stripeCustomerId){
    const customer=await stripe.customers.create({
      email:user.email as string,
      name:user.name as string
    })

    stripeCustomerId=customer.id;

    await prisma.user.update({
      where:{
        id:user.id
      },
      data:{
        stripeCustomerId:customer.id
      }
    })
    
  }
  
  const jobPost=await prisma.jobPost.create({
    data: {
      jobDescription: validateData.jobDescription,
      jobTitle: validateData.jobTitle,
      employmentType: validateData.employmentType,
      location: validateData.location,
      salaryFrom: validateData.salaryFrom,
      salaryTo: validateData.salaryTo,
      listingDuration: validateData.listingDuration,
      benefits: validateData.benefits,
      companyId: company.id,
    },
    select: {
      id: true
    }
  });

  const pricingTier=jobListingDurationPricing.find((tier)=>{
    return tier.days===validateData.listingDuration;
  })

  if(!pricingTier){
    throw new Error('Pricing tier not found');
  }

  const session =await stripe.checkout.sessions.create({
    customer:stripeCustomerId,
    line_items: [
      {
        price_data: {
          product_data: {
            name: `Job Posting - ${pricingTier.days} Days`,
            description:pricingTier.description,
            images:[
              "https://mx3t0drg0r.ufs.sh/f/Rak98HDx2mOGDQAypM5HNtSKPmL6UQcW0iywkhgoJBO9fAZn",
            ]
          },
          currency:"USD",
          unit_amount:pricingTier.price * 100,
        }, 
        quantity:1
      },
    ],
    metadata:{
      jobId:jobPost.id
    },
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
  });

  return redirect(session.url as string);


  // return redirect(`/`);
}
