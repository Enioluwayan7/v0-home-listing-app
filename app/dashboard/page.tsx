import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { PropertyCard } from "@/components/property-card"
import { DashboardClient } from "./dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is an owner
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "owner") {
    redirect("/properties")
  }

  // Fetch user's properties
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Properties</h1>
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/dashboard/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Link>
            </Button>
            <form action="/auth/logout" method="post">
              <DashboardClient />
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!properties || properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven&apos;t listed any properties yet.</p>
            <Button asChild>
              <Link href="/dashboard/new">
                <Plus className="h-4 w-4 mr-2" />
                List Your First Property
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} showActions />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
