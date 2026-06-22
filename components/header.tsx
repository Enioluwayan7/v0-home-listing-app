"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setIsAuthenticated(!!session)
      } catch (error) {
        console.error("[v0] Auth check failed:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Subscribe to auth changes
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsAuthenticated(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="HennyHomes" width={50} height={50} className="h-12 w-12" />
          <div className="hidden sm:flex flex-col">
            <span className="text-xl font-bold text-[#556B2F] leading-tight">HennyHomes</span>
            <span className="text-xs text-gray-600 font-medium">HomeConnect</span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Button asChild variant="ghost" size="icon" className="text-gray-600 hover:text-[#556B2F]">
            <Link href="/properties" title="Search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <Button asChild variant="ghost" size="sm" className="text-sm">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F]/5"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm" className="text-sm hidden sm:inline-flex">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="text-sm border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F]/5">
                    <Link href="/auth/login">Log In</Link>
                  </Button>
                  <Button asChild size="sm" className="text-sm bg-[#556B2F] hover:bg-[#4a5924] text-white">
                    <Link href="/auth/sign-up">Get Started</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
