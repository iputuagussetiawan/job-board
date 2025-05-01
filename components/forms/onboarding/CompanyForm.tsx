import React, { use, useState } from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import { companySchema } from '../../../app/utils/zodSchemas';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Loader2, XIcon } from 'lucide-react';
import { countryList } from '../../../app/utils/countriesList';
import { Textarea } from '@/components/ui/textarea';
import { UploadDropzone } from '@/components/general/UploadThingReExport';
import { createCompany } from '../../../app/action';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const CompanyForm = () => {

  const form =useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      about: "",
      location: "",
      logo: "",
      name: "",
      website: "",
      xAccount: "",
    }
  });

  const [pending, setPending]=useState(false)

  async function onSubmit(data: z.infer<typeof companySchema>) {
    try {
      setPending(true);
      await createCompany(data);
    } catch (error) {
      if (error instanceof Error && error.message !=='NEXT_REDIRECT') {
        console.log('ERROR FROM CREATE COMPANY',error.message);
      }
    }finally{
      setPending(false);
    }
  }
  return (
    <Form {...form}>
      <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Company Name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Location</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Worldwide</SelectLabel>
                    <SelectItem value="worldwide">
                      <Globe className="mr-2 h-4 w-4" />
                      Worldwide / Remote
                    </SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Location</SelectLabel>
                    {countryList.map((country) => (
                        <SelectItem value={country.name} key={country.code}>
                          <span>{country.flagEmoji}</span>
                          <span className="pl-2">{country.name}</span>
                        </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.yourcompany.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="xAccount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X(Twitter) Account</FormLabel>
                  <FormControl>
                    <Input placeholder="@yourcompany" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className='grid grid-cols-1 gap-6'>
          <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about your company" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Logo</FormLabel>
                  <FormControl>
                    <div>
                      {field.value ? (
                        <div className='relative w-fit'>
                          <Image src={field.value} alt='Company Logo' width={100} height={100} className='rounded-lg' />
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
                          endpoint="imageUploader"
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
          {pending?(<><Loader2 className="size-4 animate-spin"></Loader2><span>Submitting...</span></>):(<><span>Submit</span></>)}
        </Button>
      </form>
    </Form>
  )
}

export default CompanyForm