"use client";
import React, { useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { countryList } from '@/app/utils/countriesList'
import { useRouter, useSearchParams } from 'next/navigation'


const jobType=["full-time","part-time","contract","internship"]

const MyJobFilter = () => {
  const router = useRouter();
  //get current filters
  const searchParams = useSearchParams();
  const currentJobTypes = searchParams.get("jobTypes")?.split(",") || [];
  const currentLocation = searchParams.get("location") || "";
  console.log(currentLocation);

  function clearAllFilters() {
    router.push("/");
  }

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if(value){
        params.set(name, value);
      }else{
        params.delete(name);
      }
      return params.toString();
    },[searchParams]
  )

  function handleJobTypeChange(jobType: string, checked: boolean) {
    const current = new Set(currentJobTypes);
    if(checked){
      current.add(jobType);
    }else{
      current.delete(jobType);
    }
    const newValue = Array.from(current).join(",");
    router.push(`?${createQueryString("jobTypes", newValue)}`);
  }

  function handleLocationChange(location: string) {
    router.push(`?${createQueryString("location", location)}`);
  }
  return (
    <Card className='col-span-1 h-fit'>
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold">Filter</CardTitle>
          <Button
            variant="destructive"
            size="sm"
            className="h-8"
            onClick={clearAllFilters}
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
                <Checkbox id={job} 
                  onCheckedChange={(checked) => handleJobTypeChange(job, checked as boolean)}
                  checked={currentJobTypes.includes(job)}/>
                <Label className='text-sm font-medium' htmlFor={job}>{job}</Label>
              </div>
            ))}
          </div>
        </div>
        <Separator/>
        <div className="space-y-4">
          <Label className='text-lg font-semibold'>Location</Label>
          <Select
            onValueChange={(location) => {
              handleLocationChange(location);
            }} 
            value={currentLocation}>
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