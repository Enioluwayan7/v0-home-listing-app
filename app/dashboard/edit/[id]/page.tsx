import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EditPropertyClient } from "./edit-property-client"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch property and verify ownership
  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single()

  if (error || !property) {
    redirect("/dashboard")
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
        <h1 className="text-3xl font-bold mb-6">Edit Property</h1>
        <EditPropertyClient property={property} />
      </main>
    </div>
  )
}
