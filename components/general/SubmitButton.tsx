'use client'
import { Heart, Loader2 } from "lucide-react";
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


export function SaveJobButton({ savedJob }: { savedJob: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="outline"
      disabled={pending}
      type="submit"
      className="flex items-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Heart
            className={`size-4 transition-colors ${
              savedJob ? "fill-current text-red-500" : ""
            }`}
          />
          {savedJob ? "Saved" : "Save Job"}
        </>
      )}
    </Button>
  );
}
