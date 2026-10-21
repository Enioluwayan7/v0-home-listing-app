"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, Search, LogOut, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

const navigation = [
  { label: "Home", href: "/" },
  { label: "Find Properties", href: "/properties" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
]

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(Boolean(session))
      setIsLoading(false)
    }

    checkAuth()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session))
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await createClient().auth.signOut()
    setIsAuthenticated(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
          <Image src="/logo.png" alt="HennyHomes logo" width={46} height={46} className="size-11 object-cover" />
          <span className="flex flex-col">
            <span className="text-lg font-semibold leading-none tracking-tight text-primary">HennyHomes</span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">HomeConnect</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Button asChild variant="ghost" size="icon" aria-label="Find properties">
            <Link href="/properties"><Search data-icon="inline-start" /></Link>
          </Button>
          {!isLoading && (isAuthenticated ? (
            <>
              <Button asChild variant="ghost" size="sm"><Link href="/dashboard">Dashboard</Link></Button>
              <Button variant="outline" size="sm" onClick={handleLogout}><LogOut data-icon="inline-start" />Log out</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link href="/auth/login">Log in</Link></Button>
              <Button asChild size="sm"><Link href="/auth/sign-up">Create account</Link></Button>
            </>
          ))}
          <Button asChild size="sm" variant="secondary" className="ml-1"><Link href="/auth/sign-up">List a Property</Link></Button>
        </div>

        <Button variant="ghost" size="icon" className="sm:hidden" aria-label={isMenuOpen ? "Close menu" : "Open menu"} onClick={() => setIsMenuOpen((open) => !open)}>
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border bg-background px-5 py-5 sm:hidden">
          <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-foreground" onClick={() => setIsMenuOpen(false)}>{item.label}</Link>
            ))}
            <div className="flex flex-col gap-2 border-t border-border pt-4">
              {isAuthenticated ? <Button variant="outline" onClick={handleLogout}>Log out</Button> : <><Button asChild variant="outline"><Link href="/auth/login">Log in</Link></Button><Button asChild><Link href="/auth/sign-up">Create account</Link></Button></>}
              <Button asChild variant="secondary"><Link href="/auth/sign-up">List a Property</Link></Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
