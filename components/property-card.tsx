"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, MapPin, Bed, Bath, Square, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import type { Database } from "@/lib/database.types"

type Property = Database["public"]["Tables"]["properties"]["Row"]

interface PropertyCardProps {
  property: Property
  onDelete?: (id: string) => void
  showActions?: boolean
}

export function PropertyCard({ property, onDelete, showActions = false }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-muted flex items-center justify-center">
        <Home className="h-16 w-16 text-muted-foreground" />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-pretty">{property.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {property.location}
            </CardDescription>
          </div>
          <Badge variant={property.status === "available" ? "default" : "secondary"} className="shrink-0">
            {property.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{property.description}</p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4 text-muted-foreground" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4 text-muted-foreground" />
            <span>{property.bathrooms}</span>
          </div>
          {property.area_sqft && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4 text-muted-foreground" />
              <span>{property.area_sqft} sqft</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold">${property.price.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground capitalize">{property.property_type}</p>
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="gap-2">
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <Link href={`/dashboard/edit/${property.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" className="flex-1" onClick={() => onDelete?.(property.id)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
