import arcjet, { detectBot } from "@/app/utils/arcjet";
import { getFlagEmoji } from "@/app/utils/countriesList";
import { prisma } from "@/app/utils/db";
import { benefits } from "@/app/utils/listOfBenefits";
import { JsonToHtml } from "@/components/general/JsonToHtml";
import { GeneralSubmitButton } from "@/components/general/SubmitButtons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { request } from "@arcjet/next";
import { Heart } from "lucide-react";
import Image from "next/image";

import { notFound } from "next/navigation";

const aj =arcjet.withRule(
  detectBot({
    mode:"LIVE",
    allow:['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW'],
  })
)

async function getJob(jobId: string) {
  const jobData=await prisma.jobPost.findUnique({
    where:{
      status:"ACTIVE",
      id:jobId
    },
    select:{
      jobTitle:true,
      jobDescription:true,
      location:true,
      employmentType:true,
      benefits:true,
      salaryFrom:true,
      salaryTo:true,
      createdAt:true,
      listingDuration:true,
      company:{
        select :{
          name:true,
          logo:true,
          location:true,
          about:true
        }
      }
    }
  })

  if(!jobData){
    return notFound();
  }
  return jobData;
}

type Params = Promise<{jobId: string;}>


const JobIdPage = async ({ params }: { params: Params }) => {
  const {jobId} = await params;
  const req=await request()
  const decision=await aj.protect(req);

  if(decision.isDenied()){
    throw new Error('FORBIDDEN');
  }


  const data=await getJob(jobId);

  const locationFlag=getFlagEmoji(data.location);
  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8">
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {data.jobTitle}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-muted-foreground font-medium"> {data.company.name}</p>
              <Badge className="rounded-full" variant={"secondary"}>{data.employmentType}</Badge>
              <span className="hidden md:inline text-muted-foreground">*</span>
              <Badge className="rounded-full">{locationFlag && <span className="mr-1">{locationFlag}</span>} {data.location}</Badge>
            </div>
          </div>
          <Button variant={"outline"}>
            <Heart className="size-4" />
            Save Job
          </Button>
        </div>
        <section>
          <Label>Job Description</Label>
          <JsonToHtml json={JSON.parse(data.jobDescription)} />
        </section>
        <section>
          <h2 className="font-medium mb-4">
            Benefit  <span className="text-sm text-muted-foreground">(Green is offered)</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {benefits.map((benefit) => {
                const isOffered = data.benefits.includes(benefit.id);
                return (
                  <Badge
                    key={benefit.id}
                    variant={isOffered ? "default" : "outline"}
                    className={`text-sm px-4 py-1.5 rounded-full ${
                      !isOffered && " opacity-75 cursor-not-allowed"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {benefit.icon}
                      {benefit.label}
                    </span>
                  </Badge>
                );
              })}
          </div>
        </section>
      </div>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Apply now</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Please let {data.company.name} know you found this job on
                Job Board. This helps us grow!
              </p>
            </div>
            <form>
              <input type="hidden" name="jobId" value={jobId} />
              <GeneralSubmitButton text="Apply now" />
            </form>
          </div>
        </Card>

        <Card className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold">About the job</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Apply before
                  </span>
                  <span className="text-sm">
                    {new Date(
                      data.createdAt.getTime() +
                        data.listingDuration * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Posted on
                  </span>
                  <span className="text-sm">
                    {data.createdAt.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Employment type
                  </span>
                  <span className="text-sm">{data.employmentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Location
                  </span>
                  <Badge variant="secondary">{data.location}</Badge>
                </div>
              </div>
            </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src={
                  data.company.logo ??
                  `https://avatar.vercel.sh/${data.company.name}`
                }
                alt={data.company.name}
                width={48}
                height={48}
                className="rounded-full size-12"
              />
              <div>
                <h3 className="font-semibold">{data.company.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {data.company.about}
                </p>
              </div>
            </div>
            {/*  <Button variant="outline" className="w-full">
              View company profile
            </Button> */}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JobIdPage;
