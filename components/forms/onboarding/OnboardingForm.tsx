'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import Logo from "@/public/logo.png"
import { Card, CardContent } from '@/components/ui/card'
import UserTypeForm from '@/components/forms/onboarding/UserTypeForm'
import CompanyForm from '@/components/forms/onboarding/CompanyForm'
import JobSeekerForm from './JobSeekerForm'


type UserSelectionType = "company" | "jobSeeker" | null
const OnboardingForm = () => {
  const [step, setStep]=useState(1)
  const [userType, setUserType]=useState<UserSelectionType>(null)

  function handleUserTypeSelection(userType: UserSelectionType) {
    setUserType(userType)
    setStep(2)
  }

  function renderStep() {
    switch(step) {
      case 1:
        return (
          <UserTypeForm onSelect={handleUserTypeSelection}/>
        )
      case 2:
        return userType === "company" ? (
          <CompanyForm />
        ): (
          <JobSeekerForm />
        )
      default:
        return null
    }
  }
  return (
    <>  
      <div className='flex items-center gap-1 mb-10'>
        <Image src={Logo} alt='Job Board' width={40} height={40} />
        <h1 className='text-4xl font-bold'>Job<span className='text-primary'>Board</span></h1>
      </div>
      <Card className='max-w-lg w-full'>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>
    </>
  )
}

export default OnboardingForm