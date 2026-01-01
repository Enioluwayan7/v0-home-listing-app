"use client"

import { createClient } from "@/lib/supabase/client"
import { PropertyForm } from "@/components/property-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Database } from "@/lib/database.types"

type Property = Database["public"]["Tables"]["properties"]["Row"]
type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"]

export function EditPropertyClient({ property }: { property: Property }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: PropertyInsert) => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("properties")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", property.id)

      if (error) throw error

      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Error updating property:", error)
      alert("Failed to update property. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PropertyForm initialData={property} onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Save Changes" />
  )
}
