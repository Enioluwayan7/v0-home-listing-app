import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PropertyCard } from "@/components/property-card"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"

export default async function PropertiesPage() {
  const supabase = await createClient()

  let properties = null
  let error = null

  try {
    const { data, error: queryError } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false })

    if (queryError) {
      console.error("[v0] Properties query error:", queryError)
      error = queryError
    } else {
      properties = data
    }
  } catch (err) {
    console.error("[v0] Properties fetch error:", err)
    error = err
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 text-[#556B2F]">Available Properties</h1>
          <p className="text-gray-600 mb-6">Browse verified listings from property owners</p>
          <div className="flex gap-3 max-w-2xl">
            <Input placeholder="Search by location..." className="flex-1 border-gray-300" />
            <Button className="olive-green">Search</Button>
          </div>
        </div>

        {error ? (
          <div className="text-center py-20">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-yellow-800 font-semibold mb-2">Unable to load properties</p>
              <p className="text-yellow-700 text-sm">
                {error instanceof Error ? error.message : "There was an issue connecting to the database. Please try again later."}
              </p>
            </div>
          </div>
        ) : !properties || properties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No properties available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`} className="hover:scale-105 transition-transform">
                <PropertyCard property={property} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
