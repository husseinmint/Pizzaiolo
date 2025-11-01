"use client"

import { useUser } from "@/lib/auth/hooks"
import { signOut } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogIn, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function AuthButton() {
  const { user, loading } = useUser()
  const router = useRouter()

  if (loading) {
    return <div className="w-10 h-10" />
  }

  if (!user) {
    return (
      <Link href="/auth/login">
        <Button variant="outline" className="gap-2">
          <LogIn className="w-4 h-4" />
          Sign in
        </Button>
      </Link>
    )
  }

  async function handleSignOut() {
    await signOut()
    router.push("/auth/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <User className="w-4 h-4" />
          {user.email}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


