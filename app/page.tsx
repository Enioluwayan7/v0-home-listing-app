import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Bath, BedDouble, Check, Home, MapPin, MessageCircle, Search, ShieldCheck, Sparkles } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/database.types"

type Property = Database["public"]["Tables"]["properties"]["Row"]

async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false })
      .limit(3)
    return data ?? []
  } catch {
    return []
  }
}

function PropertyPreview({ property }: { property: Property }) {
  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <article className="overflow-hidden border border-border bg-card transition-shadow hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image src="/hero-home.png" alt={property.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
          <Badge className="absolute left-4 top-4 bg-background text-primary hover:bg-background">Available</Badge>
        </div>
        <div className="p-5">
          <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin data-icon="inline-start" />{property.location}</p>
          <h3 className="line-clamp-1 text-lg font-semibold text-foreground">{property.title}</h3>
          <p className="mt-3 text-xl font-semibold text-primary">₦{property.price.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ period</span></p>
          <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><BedDouble data-icon="inline-start" />{property.bedrooms} beds</span>
            <span className="flex items-center gap-1.5"><Bath data-icon="inline-start" />{property.bathrooms} baths</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default async function HomePage() {
  const properties = await getFeaturedProperties()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative isolate min-h-[610px] overflow-hidden bg-primary">
          <Image src="/hero-home.png" alt="Modern home in Nigeria" fill priority className="-z-10 object-cover object-center opacity-75" sizes="100vw" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-primary/70 to-transparent" />
          <div className="mx-auto flex min-h-[610px] max-w-7xl items-center px-5 py-20 lg:px-8">
            <div className="max-w-2xl text-primary-foreground">
              <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-secondary"><Sparkles data-icon="inline-start" /> A better way to move</p>
              <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">Find a place to call home.</h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-primary-foreground/80 md:text-lg">Discover properties that fit your lifestyle and budget. Connect directly with landlords and make your next move with confidence.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary"><Link href="/properties">Explore properties <ArrowRight data-icon="inline-end" /></Link></Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link href="/auth/sign-up">List a property</Link></Button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 hidden w-full max-w-5xl -translate-x-1/2 translate-y-1/2 lg:block">
            <div className="grid grid-cols-[1.4fr_1fr_1fr_auto] items-end gap-0 border border-border bg-background p-2 shadow-xl">
              <label className="flex flex-col gap-1 border-r border-border px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location<input className="border-0 bg-transparent p-0 text-sm font-normal normal-case tracking-normal text-foreground outline-none" placeholder="Where do you want to live?" /></label>
              <label className="flex flex-col gap-1 border-r border-border px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Property type<select className="bg-transparent text-sm font-normal normal-case tracking-normal text-foreground outline-none"><option>Any property type</option><option>Apartment</option><option>House</option></select></label>
              <label className="flex flex-col gap-1 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Budget<select className="bg-transparent text-sm font-normal normal-case tracking-normal text-foreground outline-none"><option>Any budget</option><option>Under ₦1m</option><option>₦1m – ₦5m</option></select></label>
              <Button asChild size="lg" className="h-14"><Link href="/properties"><Search data-icon="inline-start" />Find properties</Link></Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 pt-28 lg:px-8" id="featured-properties">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground">Curated for you</p><h2 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">Find your next home</h2></div><Button asChild variant="ghost"><Link href="/properties">View all properties <ArrowRight data-icon="inline-end" /></Link></Button></div>
          {properties.length > 0 ? <div className="mt-10 grid gap-6 md:grid-cols-3">{properties.map((property) => <PropertyPreview key={property.id} property={property} />)}</div> : <div className="mt-10 border border-dashed border-border bg-card p-12 text-center"><Home className="mx-auto size-10 text-muted-foreground" /><h3 className="mt-4 text-lg font-semibold">No properties available yet</h3><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">New listings will appear here as landlords add them. Be the first to list a property.</p><Button asChild className="mt-6"><Link href="/auth/sign-up">List a property</Link></Button></div>}
        </section>

        <section className="border-y border-border bg-card" id="how-it-works"><div className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="max-w-xl"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground">Simple by design</p><h2 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">A more direct way to find home.</h2></div><div className="mt-12 grid gap-10 md:grid-cols-3"><div><span className="text-sm font-semibold text-secondary-foreground">01</span><h3 className="mt-4 text-xl font-semibold">Discover</h3><p className="mt-3 leading-7 text-muted-foreground">Search properties based on your preferred location, budget, and needs.</p></div><div><span className="text-sm font-semibold text-secondary-foreground">02</span><h3 className="mt-4 text-xl font-semibold">Connect</h3><p className="mt-3 leading-7 text-muted-foreground">Reach out to landlords directly through supported contact options.</p></div><div><span className="text-sm font-semibold text-secondary-foreground">03</span><h3 className="mt-4 text-xl font-semibold">Move in</h3><p className="mt-3 leading-7 text-muted-foreground">Arrange a viewing, confirm the details, and take the next step.</p></div></div></div></section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center lg:px-8" id="about"><div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground">Why HennyHomes</p><h2 className="text-3xl font-semibold leading-tight tracking-tight text-primary md:text-4xl">Property search with more clarity and less friction.</h2><p className="mt-5 max-w-lg leading-7 text-muted-foreground">We make it easier for renters to understand their options and for landlords to connect with people who are genuinely looking.</p><div className="mt-8 grid gap-4 sm:grid-cols-2">{["Direct landlord connections", "Clear property information", "Convenient discovery tools", "A simpler path to moving in"].map((item) => <div key={item} className="flex items-start gap-3 text-sm"><Check className="mt-0.5 text-secondary-foreground" />{item}</div>)}</div></div><div className="border border-border bg-primary p-8 text-primary-foreground md:p-12"><ShieldCheck className="size-9 text-secondary" /><h3 className="mt-8 text-2xl font-semibold">Make your next move with confidence.</h3><p className="mt-4 leading-7 text-primary-foreground/75">Take your time, ask the right questions, and find a property that feels right for you.</p><Button asChild variant="secondary" className="mt-8"><Link href="/properties">Explore properties</Link></Button></div></section>

        <section className="bg-primary px-5 py-20 text-center text-primary-foreground"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Your next chapter</p><h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Your next home starts here.</h2><p className="mx-auto mt-5 max-w-xl text-primary-foreground/75">Explore available properties and take the next step towards a place that feels right.</p><div className="mt-8 flex justify-center gap-3"><Button asChild variant="secondary"><Link href="/properties">Explore properties</Link></Button><Button asChild variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link href="/auth/sign-up">List your property</Link></Button></div></section>
      </main>
      <footer className="border-t border-border bg-background"><div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 lg:flex-row lg:items-start lg:justify-between lg:px-8"><div><div className="flex items-center gap-3"><Image src="/logo.png" alt="HennyHomes logo" width={38} height={38} className="size-9 object-cover" /><span className="font-semibold text-primary">HennyHomes</span></div><p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">A more direct way to discover and connect with your next home.</p></div><div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground"><Link href="/properties" className="hover:text-primary">Find properties</Link><Link href="/auth/sign-up" className="hover:text-primary">List a property</Link><Link href="/auth/login" className="hover:text-primary">Log in</Link><span>© 2026 HennyHomes</span></div></div></footer>
    </div>
  )
}
