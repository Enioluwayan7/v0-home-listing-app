import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Home, Search, MessageCircle, Shield } from "lucide-react"
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6" />
              <span className="text-xl font-bold">HomeConnect</span>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost">
                <Link href="/properties">Browse Properties</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </header>

        <main>
          <section className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-5xl font-bold mb-6 text-balance">Find Your Perfect Home</h1>
            <p className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
              Connect directly with property owners and discover your next home. No middlemen, no hassle.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/properties">
                  <Search className="h-5 w-5 mr-2" />
                  Browse Properties
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/sign-up">List Your Property</Link>
              </Button>
            </div>
          </section>

          <section className="bg-muted/50 py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center mb-4">
                      <Search className="h-6 w-6" />
                    </div>
                    <CardTitle>Search Properties</CardTitle>
                    <CardDescription>Browse through verified listings from property owners</CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center mb-4">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <CardTitle>Connect Directly</CardTitle>
                    <CardDescription>Message property owners directly through our platform</CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center mb-4">
                      <Shield className="h-6 w-6" />
                    </div>
                    <CardTitle>Secure & Safe</CardTitle>
                    <CardDescription>All listings are verified and your data is protected</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 py-20 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you&apos;re looking for a home or listing a property, HomeConnect makes it easy.
            </p>
            <Button asChild size="lg">
              <Link href="/auth/sign-up">Create Free Account</Link>
            </Button>
          </section>
        </main>

        <footer className="border-t py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 HomeConnect. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Suspense>
  )
}
