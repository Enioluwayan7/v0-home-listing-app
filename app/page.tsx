import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Search, MessageCircle, Shield, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <div className="min-h-screen bg-white">
        <Header />

        <main>
          <section className="relative bg-gradient-to-br from-[#556B2F]/5 via-white to-[#5fa855]/5 py-24 md:py-32">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance text-[#556B2F]">Find Your Perfect Home</h1>
              <p className="text-lg md:text-xl text-gray-600 mb-10 text-balance max-w-2xl mx-auto leading-relaxed">
                Connect directly with property owners and discover your next home. No middlemen, no hassle, just genuine connections.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="olive-green">
                  <Link href="/properties">
                    <Search className="h-5 w-5 mr-2" />
                    Browse Properties
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F]/5">
                  <Link href="/auth/sign-up">
                    List Your Property
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="section-header">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="feature-card">
                  <div className="h-14 w-14 rounded-xl bg-[#556B2F]/10 text-[#556B2F] flex items-center justify-center mb-4">
                    <Search className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#556B2F]">Search Properties</h3>
                  <p className="text-gray-600">Browse through verified listings from property owners in your area</p>
                </div>

                <div className="feature-card">
                  <div className="h-14 w-14 rounded-xl bg-[#5fa855]/10 text-[#5fa855] flex items-center justify-center mb-4">
                    <MessageCircle className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#556B2F]">Connect Directly</h3>
                  <p className="text-gray-600">Message property owners directly through our secure platform</p>
                </div>

                <div className="feature-card">
                  <div className="h-14 w-14 rounded-xl bg-[#556B2F]/10 text-[#556B2F] flex items-center justify-center mb-4">
                    <Shield className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#556B2F]">Secure & Safe</h3>
                  <p className="text-gray-600">All listings are verified and your personal data is fully protected</p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 bg-gradient-to-r from-[#556B2F] to-[#5fa855]">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-6 text-white">Ready to Get Started?</h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Whether you&apos;re looking for your dream home or listing a property, HomeConnect makes it simple and secure.
              </p>
              <Button asChild size="lg" className="bg-white text-[#556B2F] hover:bg-gray-100">
                <Link href="/auth/sign-up">Create Free Account</Link>
              </Button>
            </div>
          </section>
        </main>

        <footer className="border-t border-gray-200 bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-semibold text-[#556B2F] mb-4">HomeConnect</h4>
                <p className="text-sm text-gray-600">Connecting renters and property owners directly.</p>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-3 text-sm">For Renters</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/properties" className="hover:text-[#556B2F]">Browse Properties</Link></li>
                  <li><Link href="/auth/sign-up" className="hover:text-[#556B2F]">Create Account</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-3 text-sm">For Owners</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/auth/sign-up" className="hover:text-[#556B2F]">List Property</Link></li>
                  <li><Link href="/auth/login" className="hover:text-[#556B2F]">Sign In</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-3 text-sm">Legal</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-[#556B2F]">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-[#556B2F]">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
              <p>&copy; 2026 HomeConnect. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Suspense>
  )
}
