import Link from 'next/link'
import React from 'react'
import Logo from "@/public/logo.png"
import Image from 'next/image'
import { Button, buttonVariants } from '../ui/button'
import { ThemeToggle } from './ThemeToggle'
import { auth, signOut } from '@/app/utils/auth'

const Navbar = async () => {
  const session = await auth();
  return (
    <nav className='flex items-center justify-between py-5'>
      <Link href="/" className='flex items-center gap-2'> 
        <Image src={Logo} alt='Job Board' width={40} height={40} />
        <h1 className='text-2xl font-bold'>Job<span className='text-primary'>Board</span></h1>
      </Link>
      <div className='flex items-center gap-2'>
        <ThemeToggle />
        {
          session?.user ?(
            <form action={async () => {
              "use server";
              await signOut({redirectTo: "/"});
            }}>
              <Button>Logout</Button>
            </form>
          ) : (
            <Link href="/login" className={buttonVariants({variant:"outline", size:"lg"})}>Login</Link>
          )
        }
      
      </div>
    </nav>
  )
}

export default Navbar