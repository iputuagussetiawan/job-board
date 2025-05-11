import { prisma } from "@/app/utils/db";
import { inngest } from "@/app/utils/inngest/client";
// import { Select } from "@radix-ui/react-select";
// import { stat } from "fs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const sendPeriodicJobListings=inngest.createFunction(
  {
    id: "send-job-listings",
  },
  {
    event: "jobseeker/created",
  },

  async ({ event, step }) => {
    const {userId}=event.data

    const totalDays=30;
    const internalDays=2
    let currentDay=0;

    while(currentDay<totalDays){
      await step.sleep("wait-internal", `${internalDays}d`);
      currentDay+=internalDays;

      const recentJobs=await step.run('fetch-recent-jobs', async () => {
        return await prisma.jobPost.findMany({
          where: {
            status: "ACTIVE",
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
          include: {
            company:{
              select:{
                name:true,

              }
            }
          }
        })
      });

      if(recentJobs.length>0){
        await step.run('send-email', async () => {
          const jobListingHtml=recentJobs.map((job) => `
            <div style="margin-bottom:20px;padding:15px;border:1px solid #eee; border-radius:5px">
              <h3 style="margin-bottom:10px">${job.jobTitle}</h3>
              <p style="margin:5px 0px">${job.company.name} * ${job.location}</p>
              <p style="margin:5px 0px">${job.employmentType}</p>
              <p style="margin:5px 0px">$${job.salaryFrom.toLocaleString()} - $${job.salaryTo.toLocaleString()}</p>
            </div>`).join('');

            await resend.emails.send({
              from: 'Job Board <onboarding@resend.dev>',
              to: ["agussetiawaniputu@gmail.com"],
              subject: "Latest Job Opportunities for you",
              html: `
                <div style="font-family:Arial, sans-serif; max-width:600px; margin:0px auto;">
                  <h2 style="margin-bottom:10px">Latest Job Opportunities</h2>
                  <p style="margin:5px 0px">Here are the latest job opportunities for you:</p>
                  ${jobListingHtml}
                  <div style="margin-top:20px; text-align:center">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="background-color:#000; color:#fff; padding:10px 20px; border-radius:5px; text-decoration:none">View All Jobs</a>
                  </div>
                </div>`,
            });
        })
      }
    }
    return {userId, message:"Completed 30 day job listing notification"}
  },
)