import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="h-10 w-10 rounded-lg bg-olive-green flex items-center justify-center">
            <Home className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-olive-green hidden sm:inline">HomeConnect</span>
        </Link>
        
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button asChild variant="ghost" size="sm" className="text-sm">
            <Link href="/properties">Browse</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="text-sm">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button asChild size="sm" className="text-sm bg-olive-green hover:bg-olive-green/90 text-white">
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
