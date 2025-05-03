"use client";
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { X, XIcon } from 'lucide-react'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { countryList } from '@/app/utils/countriesList'
import { useSearchParams } from 'next/navigation'


const jobType=["full-time","part-time","contract","internship"]

const MyJobFilter = () => {
  const searchParams = useSearchParams();
  const currentLocation = searchParams.get("location") || "";
  return (
    <Card className='col-span-1 h-fit'>
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold">Filter</CardTitle>
          <Button
            variant="destructive"
            size="sm"
            className="h-8"
          >
            <span className="mr-2">Clear all</span>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Separator />
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-4'>
          <Label className='text-lg font-semibold'>Job Type</Label>
          <div className='grid grid-cols-2 gap-4'>
            {jobType.map((job, index)=>(
              <div key={index} className='flex items-center space-x-2'>
                <Checkbox id={job} />
                <Label className='text-sm font-medium' htmlFor={job}>{job}</Label>
              </div>
            ))}
          </div>
        </div>
        <Separator/>
        <div className="space-y-4">
          <Label className='text-lg font-semibold'>Location</Label>
          <Select value={currentLocation}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Worldwide</SelectLabel>
                <SelectItem value="worldwide">
                  <span>🌍</span>
                  <span className="pl-2">Worldwide / Remote</span>
                </SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Location</SelectLabel>
                {countryList.map((country) => (
                  <SelectItem value={country.name} key={country.name}>
                    <span>{country.flagEmoji}</span>
                    <span className="pl-2">{country.name}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

export default MyJobFilter