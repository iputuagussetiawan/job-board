import { createJobSeeker } from '@/app/action'
import { jobSeekerSchema } from '@/app/utils/zodSchemas'
import { UploadDropzone } from '@/components/general/UploadThingReExport'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, XIcon } from 'lucide-react'
import Image from 'next/image'
import React, { use, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import PdfImage from '../../../public/pdf.png'

const JobSeekerForm = () => {
  const form =useForm<z.infer<typeof jobSeekerSchema>>({
    resolver:zodResolver(jobSeekerSchema),
    defaultValues:{
      about: "",
      name: "",
      resume: "",
    }
  })

    const [pending, setPending]=useState(false)

  async function onSubmit(data: z.infer<typeof jobSeekerSchema>) {
      try {
        setPending(true);
        await createJobSeeker(data);
      } catch (error) {
        if (error instanceof Error && error.message !=='NEXT_REDIRECT') {
          console.log('ERROR FROM CREATE JOB-SEEKER',error.message);
        }
      }finally{
        setPending(false);
      }
    }
  return (
    <Form {...form}>
      <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid grid-cols-1 md:grid-cols-1 gap-6'>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us about yourself" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume(PDF)</FormLabel>
                  <FormControl>
                    <div>
                      {field.value ? (
                        <div className='relative w-fit'>
                          <Image src={PdfImage} alt='your resume' width={100} height={100} className='rounded-lg' />
                          <Button
                            type='button'
                            variant="destructive"
                            size="icon"
                            className='cursor-pointer absolute -top-2 -right-2' 
                            onClick={() => field.onChange('')}>
                            <XIcon className='size-4' />
                          </Button>
                        </div>
                      ):(
                        <UploadDropzone
                          endpoint="resumeUploader"
                          onClientUploadComplete={(res) => {
                            field.onChange(res[0].ufsUrl);
                            // toast.success("Logo uploaded successfully!");
                          }}
                          onUploadError={() => {
                            // toast.error("Something went wrong. Please try again.");
                            console.log("Something went wrong. Please try again.");
                          }}
                          className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <Button type="submit" className='w-full' disabled={pending}>
          {pending?(<><Loader2 className="size-4 animate-spin"></Loader2><span>Submitting...</span></>):(<><span>Continue</span></>)}
        </Button>
      </form>
    </Form>
  )
}

export default JobSeekerForm