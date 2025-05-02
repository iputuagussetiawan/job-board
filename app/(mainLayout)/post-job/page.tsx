import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import ArcjetLogo from '@/public/arcjet.jpg'
import InngestLogo from '@/public/inngest-locale.png'
import Image from 'next/image'
import { CreateJobForm } from '@/components/forms/CreateJobForm'
import { prisma } from '@/app/utils/db'
import { redirect } from 'next/navigation'
import { requireUser } from '@/app/utils/requireUser'

const companies=[
  {id:0, name:'ArcJet', logo:ArcjetLogo},
  {id:1, name:'Inngest', logo:InngestLogo},
  {id:2, name:'ArcJet', logo:ArcjetLogo},
  {id:3, name:'Inngest', logo:InngestLogo},
  {id:4, name:'ArcJet', logo:ArcjetLogo},
  {id:5, name:'Inngest', logo:InngestLogo}
]



const testimonials = [
  {
    quote: 'Job Board made hiring easier and faster.',
    company: 'SkyNet Solutions',
    name: 'Alice Johnson',
    title: 'Head of Talent',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    quote: 'An incredible platform to connect with top talent.',
    company: 'NovaTech',
    name: 'Michael Smith',
    title: 'CTO',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    quote: 'We’ve seen great results since using Job Board.',
    company: 'BrightWorks',
    name: 'Linda Chen',
    title: 'Recruitment Manager',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    quote: 'Highly recommend for growing startups.',
    company: 'TechHive',
    name: 'Carlos Rivera',
    title: 'COO',
    avatar: 'https://images.pexels.com/photos/3775536/pexels-photo-3775536.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

const stats = [
  { value: "10k+", label: "Monthly active job seekers" },
  { value: "48h", label: "Average time to hire" },
  { value: "95%", label: "Employer satisfaction rate" },
  { value: "500+", label: "Companies hiring monthly" },
];

async function getCompany(userId: string) {
  const data = await prisma.company.findUnique({
    where: {
      userId: userId,
    },
    select: {
      name: true,
      location: true,
      about: true,
      logo: true,
      xAccount: true,
      website: true,
    },
  });

  if (!data) {
    return redirect("/");
  }
  return data;
}

const PostJobPage = async() => {
  const session = await requireUser();
  const data = await getCompany(session.id as string);
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5'>
      <CreateJobForm
        companyAbout={data.about}
        companyLocation={data.location}
        companyLogo={data.logo}
        companyName={data.name}
        companyXAccount={data.xAccount}
        companyWebsite={data.website}
      />
      <div className='col-span-1'> 
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Trusted by industry Leaders</CardTitle>
            <CardDescription>Join thousands of companies using Job Board</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid grid-cols-3 gap-4'>
              {companies.map((company) => (
                <div key={company.id} className='flex items-center gap-2'>
                  <Image src={company.logo.src} alt={company.name} width={80} height={80} className='rounded-lg opacity-75 transition-opacity hover:opacity-100' />
                  {/* <span>{company.name}</span> */}
                </div>
              ))}
            </div>
            <div className='space-y-4'>
              {
                testimonials.map((testimonial, index) => (
                  <blockquote key={index} className='border-l-2 border-l-primary pl-4'>
                    <p className='text-sm text-muted-foreground italic'>"{testimonial.quote}"</p>
                    <footer className='mt-2 text-sm font-medium'>
                      - {testimonial.name}, {testimonial.company}
                    </footer>
                  </blockquote>
                ))
              }
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="rounded-lg bg-muted p-4">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PostJobPage