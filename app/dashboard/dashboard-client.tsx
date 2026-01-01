"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export function DashboardClient() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <Button variant="outline" onClick={handleSignOut}>
      <LogOut className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  )
}
