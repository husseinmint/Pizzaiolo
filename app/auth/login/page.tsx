"use client"

import { useState } from "react"
import { signInWithGoogle } from "@/lib/auth/client-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChefHat } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Chrome } from "lucide-react"

export default function LoginPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function handleGoogleSignIn() {
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign in with Google",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <ChefHat className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Pizzailo</CardTitle>
          <CardDescription>Sign in with your Google account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGoogleSignIn}
            className="w-full gap-2"
            disabled={loading}
            size="lg"
          >
            <Chrome className="w-5 h-5" />
            {loading ? "Signing in..." : "Continue with Google"}
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

