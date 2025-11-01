import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}) {
  const params = await searchParams
  
  // Handle OAuth callback if code is present
  if (params.code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(params.code)
    
    if (!error) {
      redirect("/recipes")
    }
  }
  
  redirect("/recipes")
}
