import Link from "next/link"
import { Search, SlidersHorizontal } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PropertyCard } from "@/components/property-card"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/database.types"

type Property = Database["public"]["Tables"]["properties"]["Row"]

export default async function PropertiesPage() {
  let properties: Property[] = []
  let hasError = false

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("properties").select("*").eq("status", "available").order("created_at", { ascending: false })
    if (error) hasError = true
    properties = data ?? []
  } catch {
    hasError = true
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="max-w-2xl"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground">Property discovery</p><h1 className="text-4xl font-semibold tracking-tight text-primary md:text-5xl">Find your next home</h1><p className="mt-4 leading-7 text-muted-foreground">Browse available properties and connect directly with the people behind each listing.</p></div>
        <div className="mt-10 flex flex-col gap-3 border border-border bg-card p-3 md:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input className="h-12 border-0 bg-muted pl-10" placeholder="Search by location or neighbourhood" /></div><Button variant="outline" className="h-12"><SlidersHorizontal data-icon="inline-start" />Filters</Button><Button className="h-12">Search properties</Button></div>
        <div className="mt-12 flex items-center justify-between border-b border-border pb-4"><p className="text-sm text-muted-foreground">{properties.length} available {properties.length === 1 ? "property" : "properties"}</p><select className="bg-transparent text-sm text-muted-foreground outline-none"><option>Newest first</option><option>Price: low to high</option><option>Price: high to low</option></select></div>
        {hasError ? <div className="mt-10 border border-dashed border-border p-12 text-center"><h2 className="text-lg font-semibold">We couldn&apos;t load properties</h2><p className="mt-2 text-sm text-muted-foreground">Please try again shortly.</p></div> : properties.length === 0 ? <div className="mt-10 border border-dashed border-border p-12 text-center"><h2 className="text-lg font-semibold">No properties available</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">There are no listings matching your search yet. Check back soon or list a property of your own.</p><Button asChild className="mt-6"><Link href="/auth/sign-up">List a property</Link></Button></div> : <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{properties.map((property) => <PropertyCard key={property.id} property={property} />)}</div>}
      </main>
    </div>
  )
}
