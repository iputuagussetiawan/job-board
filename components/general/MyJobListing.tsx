import { prisma } from '@/app/utils/db'
import React from 'react'
import { EmptyState } from './EmptyState';
import MyJobCard from './MyJobCard';
import { PaginationComponent } from './PaginationComponent';



async function getData(
  page: number=1,
  pageSize: number=1
){
  await new Promise((resolve) => setTimeout(resolve, 2000)); //testing skelton loading you can remove it , just for testing
  const skip=(page-1)*pageSize;
  const [data,totalCount]=await Promise.all([
    prisma.jobPost.findMany({
      where:{
        status:"ACTIVE",
      },
      take:pageSize,
      skip:skip,
      select:{
        id:true,
        createdAt:true,
        company:{
          select :{
            name:true,
            logo:true,
            location:true,
            about:true
          }
        },
        jobTitle:true,
        employmentType:true,
        location:true,
        salaryFrom:true,
        salaryTo:true,
      },
      orderBy:{
        createdAt:"desc"
      }
    }),
    prisma.jobPost.count({
      where:{
        status:"ACTIVE",
      }
    })
  ])
  return {
    jobs:data,
    totalPages:Math.ceil(totalCount/pageSize),
  }
}
const MyJobListing = async({currentPage}:{currentPage:number}) => {
  const {jobs, totalPages}=await getData(currentPage);
  return (
    <>
      {
        jobs.length>0 ? (
          <div className='flex flex-col gap-6'>
            {jobs.map((job) => (
              <MyJobCard key={job.id} job={job}/>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No jobs found"
            description="Try searching for a different job title or location."
            buttonText="Clear all filters"
            href="/"
          />
        )
      }

      <div className="flex justify-center mt-6">
        <PaginationComponent totalPages={totalPages} currentPage={currentPage} />
      </div>
    </>
  )
}

export default MyJobListing