"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Database } from "@/lib/database.types"

type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"]

interface PropertyFormProps {
  initialData?: Partial<PropertyInsert>
  onSubmit: (data: PropertyInsert) => Promise<void>
  isLoading: boolean
  submitLabel: string
}

export function PropertyForm({ initialData, onSubmit, isLoading, submitLabel }: PropertyFormProps) {
  const [formData, setFormData] = React.useState<Partial<PropertyInsert>>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    location: initialData?.location || "",
    bedrooms: initialData?.bedrooms || 1,
    bathrooms: initialData?.bathrooms || 1,
    area_sqft: initialData?.area_sqft || undefined,
    property_type: initialData?.property_type || "apartment",
    status: initialData?.status || "available",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData as PropertyInsert)
  }

  const updateField = (field: keyof PropertyInsert, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Property Title</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Beautiful 2-bedroom apartment"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe your property..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              required
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="City, State"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => updateField("price", Number.parseFloat(e.target.value))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="property_type">Property Type</Label>
              <Select value={formData.property_type} onValueChange={(value) => updateField("property_type", value)}>
                <SelectTrigger id="property_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                required
                min="0"
                value={formData.bedrooms}
                onChange={(e) => updateField("bedrooms", Number.parseInt(e.target.value))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                required
                min="0"
                value={formData.bathrooms}
                onChange={(e) => updateField("bathrooms", Number.parseInt(e.target.value))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="area_sqft">Area (sqft)</Label>
              <Input
                id="area_sqft"
                type="number"
                min="0"
                value={formData.area_sqft || ""}
                onChange={(e) => updateField("area_sqft", Number.parseInt(e.target.value) || undefined)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => updateField("status", value)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : submitLabel}
      </Button>
    </form>
  )
}
