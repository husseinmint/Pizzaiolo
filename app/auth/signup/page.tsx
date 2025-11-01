"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login since we only use Google OAuth (which handles both sign up and sign in)
    router.push("/auth/login")
  }, [router])

  return null
}

