'use client'
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

import React from 'react'
import { useFormStatus } from "react-dom";

interface GeneralSubmitButtonProps {
  text:string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
    width?:string
    icon?:React.ReactNode
}

const GeneralSubmitButton = ({text, variant, width, icon} : GeneralSubmitButtonProps) => {
  const {pending}=useFormStatus();
  return (
    <Button 
      variant={variant} 
      className={width}
      disabled={pending}
    >
        {pending?(<><Loader2 className="size-4 animate-spin"></Loader2><span>Submitting...</span></>):(
      <>
        {icon && <div>{icon}</div>}
        <span>{text}</span>
      </>
    )}</Button>
  )
}

export default GeneralSubmitButton