import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Home, MapPin, Bed, Bath, Square, User, Phone } from "lucide-react"
import Link from "next/link"
import { ContactOwnerForm } from "@/components/contact-owner-form"
import { redirect } from "next/navigation"

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: property, error } = await supabase.from("properties").select("*").eq("id", id).single()

  if (error || !property) {
    redirect("/properties")
  }

  const { data: owner } = await supabase.from("profiles").select("*").eq("id", property.owner_id).single()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            <span className="text-xl font-bold">HomeConnect</span>
          </Link>
          <Button asChild variant="ghost">
            <Link href="/properties">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <Home className="h-24 w-24 text-muted-foreground" />
            </div>

            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <Badge
                  variant={property.status === "available" ? "default" : "secondary"}
                  className="text-lg px-4 py-1"
                >
                  {property.status}
                </Badge>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{property.bathrooms} Bathrooms</span>
                </div>
                {property.area_sqft && (
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{property.area_sqft} sqft</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold text-primary">${property.price.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground capitalize">{property.property_type}</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            {owner && (
              <Card>
                <CardHeader>
                  <CardTitle>Property Owner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{owner.full_name}</span>
                  </div>
                  {owner.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{owner.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Contact Owner</CardTitle>
              </CardHeader>
              <CardContent>
                {user ? (
                  <ContactOwnerForm propertyId={property.id} ownerId={property.owner_id} senderId={user.id} />
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">Sign in to contact the property owner</p>
                    <Button asChild className="w-full">
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
