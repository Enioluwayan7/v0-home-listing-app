import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"
import { PropertyCard } from "@/components/property-card"
import { Input } from "@/components/ui/input"

export default async function PropertiesPage() {
  const supabase = await createClient()

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            <span className="text-xl font-bold">HomeConnect</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Available Properties</h1>
          <div className="flex gap-4 max-w-2xl">
            <Input placeholder="Search by location..." className="flex-1" />
            <Button>Search</Button>
          </div>
        </div>

        {!properties || properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No properties available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <PropertyCard property={property} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
