import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 text-[#556B2F]">Available Properties</h1>
          <p className="text-gray-600 mb-6">Browse verified listings from property owners</p>
        </div>

        <div className="text-center py-20">
          <p className="text-gray-600 text-lg mb-6">No properties available at the moment. Check back soon!</p>
          <Button asChild className="bg-[#556B2F] hover:bg-[#4a5924] text-white">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
