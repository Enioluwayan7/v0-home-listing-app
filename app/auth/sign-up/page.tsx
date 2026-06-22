"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Header } from "@/components/header"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<"owner" | "client">("client")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/login`,
          data: {
            full_name: fullName,
            role: role,
            phone: phone || null,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-[#556B2F]/5 to-[#5fa855]/5">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-[#556B2F] to-[#5fa855] text-white rounded-t-lg">
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription className="text-white/90">Join HennyHomes today</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSignUp}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Emmanuel Henny"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+234 705 5600 8900"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label>I am a</Label>
                      <RadioGroup value={role} onValueChange={(value) => setRole(value as "owner" | "client")}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="client" id="client" />
                          <Label htmlFor="client" className="font-normal cursor-pointer">
                            Looking for a home
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="owner" id="owner" />
                          <Label htmlFor="owner" className="font-normal cursor-pointer">
                            Property owner
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <Button type="submit" className="w-full olive-green" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Sign Up"}
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="underline underline-offset-4">
                      Sign in
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
