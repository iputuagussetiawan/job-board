'use client';

import { ChevronDown, Heart, Layers2, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "../ui/dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";
 // Ensure this is a client function
interface iAppProps{
  email: string;
  name: string;
  image: string;
}
export function UserDropdown({email, name, image}: iAppProps) {
  const handleSignOut = async () => {
    try {
      await signOut({ redirectTo: "/" });
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={image || "https://github.com/shadcn.png"}/>
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <ChevronDown size={16} strokeWidth={2} className="ml-1 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{name}</span>
          <span className="text-xs text-muted-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/favorites" className="flex items-center gap-2">
              <Heart size={16} strokeWidth={2} className="opacity-50" />
              <span>Favorites Jobs</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/my-jobs" className="flex items-center gap-2">
              <Layers2 size={16} strokeWidth={2} className="opacity-50" />
              <span>My Jobs</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}