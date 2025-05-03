import { prisma } from '@/app/utils/db'
import React from 'react'
import { EmptyState } from './EmptyState';
import MyJobCard from './MyJobCard';



async function getData(){
  const data=await prisma.jobPost.findMany({
    where:{
      status:"ACTIVE",
    },
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
  });

  return data
}
const MyJobListing = async() => {
  const data=await getData();
  return (
    <>
      {
        data.length>0 ? (
          <div className='flex flex-col gap-6'>
            {data.map((job) => (
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
    </>
  )
}

export default MyJobListing