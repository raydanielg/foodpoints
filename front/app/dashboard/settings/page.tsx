"use client"

import * as React from "react"
import { SaveIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/image-upload"
import { api, imageUrl, type Restaurant } from "@/lib/api"

export default function SettingsPage() {
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    api.getRestaurant().then((res) => {
      setRestaurant(res.restaurant)
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    if (!restaurant) return
    setSaving(true)
    setSaved(false)
    try {
      await api.updateRestaurant({
        name: restaurant.name,
        logo_url: restaurant.logo_url,
        cover_url: restaurant.cover_url,
        address: restaurant.address,
        phone: restaurant.phone,
        currency: restaurant.currency,
        vat_percent: restaurant.vat_percent,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading settings&hellip;</p>
      </div>
    )
  }

  if (!restaurant) {
    return <div className="p-6">Failed to load settings.</div>
  }

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:px-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Configure your restaurant details</p>
      </div>

      {/* Cover & Logo */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Restaurant Branding</CardTitle>
          <CardDescription>Upload your logo and cover image</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ImageUpload
            value={imageUrl(restaurant.cover_url)}
            type="cover"
            shape="wide"
            label="Cover Image"
            onChange={(url) =>
              setRestaurant({ ...restaurant, cover_url: url })
            }
          />
          <ImageUpload
            value={imageUrl(restaurant.logo_url)}
            type="logo"
            shape="square"
            label="Logo"
            onChange={(url) =>
              setRestaurant({ ...restaurant, logo_url: url })
            }
          />
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Restaurant Information</CardTitle>
          <CardDescription>Update your restaurant profile</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Restaurant Name</Label>
            <Input
              id="name"
              value={restaurant.name}
              onChange={(e) =>
                setRestaurant({ ...restaurant, name: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={restaurant.address || ""}
              onChange={(e) =>
                setRestaurant({ ...restaurant, address: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={restaurant.phone || ""}
              onChange={(e) =>
                setRestaurant({ ...restaurant, phone: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={restaurant.currency}
                onChange={(e) =>
                  setRestaurant({ ...restaurant, currency: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="vat">VAT (%)</Label>
              <Input
                id="vat"
                type="number"
                value={restaurant.vat_percent}
                onChange={(e) =>
                  setRestaurant({ ...restaurant, vat_percent: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Spinner className="size-4" />
              ) : (
                <SaveIcon className="size-4" />
              )}
              Save Changes
            </Button>
            {saved && (
              <span className="text-sm text-green-600">Saved successfully!</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
