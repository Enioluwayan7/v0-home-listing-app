"use client"

import Image from "next/image"
import Link from "next/link"
import { Bath, BedDouble, Edit, MapPin, Square, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Database } from "@/lib/database.types"

type Property = Database["public"]["Tables"]["properties"]["Row"]

interface PropertyCardProps {
  property: Property
  onDelete?: (id: string) => void
  showActions?: boolean
}

export function PropertyCard({ property, onDelete, showActions = false }: PropertyCardProps) {
  return (
    <article className="group overflow-hidden border border-border bg-card transition-shadow hover:shadow-lg">
      <Link href={`/properties/${property.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image src="/hero-home.png" alt={property.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
          <Badge className="absolute left-4 top-4 bg-background text-primary hover:bg-background">{property.status}</Badge>
        </div>
        <div className="p-5">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin data-icon="inline-start" />{property.location}</p>
          <h3 className="mt-2 line-clamp-1 text-lg font-semibold">{property.title}</h3>
          <p className="mt-3 text-xl font-semibold text-primary">₦{property.price.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ period</span></p>
          <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><BedDouble data-icon="inline-start" />{property.bedrooms}</span><span className="flex items-center gap-1.5"><Bath data-icon="inline-start" />{property.bathrooms}</span>{property.area_sqft && <span className="flex items-center gap-1.5"><Square data-icon="inline-start" />{property.area_sqft} sqft</span>}</div>
        </div>
      </Link>
      {showActions && <div className="flex gap-2 border-t border-border p-4"><Button asChild variant="outline" className="flex-1"><Link href={`/dashboard/edit/${property.id}`}><Edit data-icon="inline-start" />Edit</Link></Button><Button variant="destructive" className="flex-1" onClick={() => onDelete?.(property.id)}><Trash2 data-icon="inline-start" />Delete</Button></div>}
    </article>
  )
}
