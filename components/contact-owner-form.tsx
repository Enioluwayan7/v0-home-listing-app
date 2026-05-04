"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

interface ContactOwnerFormProps {
  propertyId: string
  ownerId: string
  senderId: string
}

export function ContactOwnerForm({ propertyId, ownerId, senderId }: ContactOwnerFormProps) {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("messages").insert({
        property_id: propertyId,
        sender_id: senderId,
        receiver_id: ownerId,
        content: message,
      })

      if (error) throw error

      setSuccess(true)
      setMessage("")
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-green-600 font-medium">Message sent successfully!</p>
        <p className="text-xs text-muted-foreground mt-2">The owner will get back to you soon.</p>
        <Button variant="outline" onClick={() => setSuccess(false)} className="mt-4 w-full">
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="message">Your Message</Label>
        <Textarea
          id="message"
          placeholder="Hi, I'm interested in this property..."
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}
