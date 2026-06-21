import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="h-10 w-10 rounded-lg bg-[#556B2F] flex items-center justify-center">
            <Home className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-[#556B2F] hidden sm:inline">HomeConnect</span>
        </Link>
        
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button asChild variant="ghost" size="icon" className="text-gray-600 hover:text-[#556B2F]">
            <Link href="/properties" title="Search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="text-sm hidden sm:inline-flex">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="text-sm border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F]/5">
            <Link href="/auth/login">Log In</Link>
          </Button>
          <Button asChild size="sm" className="text-sm bg-[#556B2F] hover:bg-[#4a5924] text-white">
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
