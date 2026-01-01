"use client"
import { createClient } from "@/lib/supabase/client"
import { PropertyForm } from "@/components/property-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Database } from "@/lib/database.types"

type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"]

export default function NewPropertyPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: PropertyInsert) => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { error } = await supabase.from("properties").insert({
        ...formData,
        owner_id: user.id,
      })

      if (error) throw error

      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Error creating property:", error)
      alert("Failed to create property. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button asChild variant="ghost">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Add New Property</h1>
        <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Create Property" />
      </main>
    </div>
  )
}
