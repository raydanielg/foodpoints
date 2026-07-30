"use client"

import * as React from "react"
import {
  SaveIcon,
  LinkIcon,
  RefreshCwIcon,
  CopyIcon,
  ShieldCheckIcon,
  ShieldAlertIcon,
} from "lucide-react"
import Link from "next/link"

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
import { toast } from "@/components/ui/toast"

export default function SettingsPage() {
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [regenerating, setRegenerating] = React.useState(false)

  React.useEffect(() => {
    api.getRestaurant().then((res) => {
      setRestaurant(res.restaurant)
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    if (!restaurant) return
    setSaving(true)
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
      toast.add({ title: "Settings saved successfully", type: "success" })
    } catch {
      toast.add({ title: "Failed to save settings", type: "error" })
    } finally {
      setSaving(false)
    }
  }

  const handleRegenerateLink = async () => {
    setRegenerating(true)
    try {
      const res = await api.regenerateLink()
      setRestaurant(res.restaurant)
      toast.add({ title: "Restaurant link regenerated", type: "success" })
    } catch {
      toast.add({ title: "Failed to regenerate link", type: "error" })
    } finally {
      setRegenerating(false)
    }
  }

  const handleCopyLink = () => {
    if (!restaurant?.restaurant_link) return
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(
        `${window.location.origin}/t/${restaurant.restaurant_link}`
      )
      toast.add({ title: "Link copied to clipboard!", type: "success" })
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

  const kycApproved = restaurant.kyc_status === "approved"

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:gap-6 lg:px-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Configure your restaurant details</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Memo Sidebar */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          <Card className="rounded-xl bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheckIcon className="size-5" />
              </div>
              <CardTitle className="text-base">Quick Memo</CardTitle>
              <CardDescription className="text-xs">
                Important notes about your settings
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Restaurant Link</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Your public link is how customers access your menu. Keep it safe and share it with your customers.
                </p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Branding</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Upload a clear logo and cover image. These appear on your customer-facing menu page.
                </p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Currency & VAT</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Set your currency symbol and VAT percentage. VAT is applied to all customer payments.
                </p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">KYC Verification</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {kycApproved
                    ? "Your restaurant is verified. Your link is active and customers can order."
                    : "Submit your KYC details to activate your restaurant link and start receiving orders."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {/* KYC Status + Restaurant Link */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Restaurant Link &amp; Verification</CardTitle>
              <CardDescription>
                Your public link and KYC verification status
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* KYC Status badge */}
              <div
                className={
                  "flex items-center gap-3 rounded-lg border p-3 " +
                  (kycApproved
                    ? "border-green-600/50 bg-green-50/50"
                    : "border-amber-600/50 bg-amber-50/50")
                }
              >
                {kycApproved ? (
                  <ShieldCheckIcon className="size-5 shrink-0 text-green-600" />
                ) : (
                  <ShieldAlertIcon className="size-5 shrink-0 text-amber-600" />
                )}
                <div className="flex-1">
                  <p
                    className={
                      "text-sm font-semibold " +
                      (kycApproved ? "text-green-900" : "text-amber-900")
                    }
                  >
                    {kycApproved ? "KYC Verified" : "KYC Pending"}
                  </p>
                  <p
                    className={
                      "text-xs " +
                      (kycApproved ? "text-green-700" : "text-amber-700")
                    }
                  >
                    {kycApproved
                      ? "Your restaurant is verified and your link is active."
                      : "Submit your KYC details to activate your restaurant link."}
                  </p>
                </div>
                {!kycApproved && (
                  <Link href="/dashboard/kyc">
                    <Button size="sm" variant="outline">
                      Submit KYC
                    </Button>
                  </Link>
                )}
              </div>

              {/* Restaurant link */}
              {restaurant.restaurant_link && (
                <div className="flex flex-col gap-2">
                  <Label>Your Restaurant Link</Label>
                  <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
                    <LinkIcon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="flex-1 truncate text-sm font-medium text-primary">
                      {typeof window !== "undefined" ? window.location.origin : ""}/t/{restaurant.restaurant_link}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopyLink}
                      className="shrink-0"
                    >
                      <CopyIcon className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRegenerateLink}
                      disabled={regenerating}
                      className="shrink-0"
                    >
                      {regenerating ? (
                        <Spinner className="size-4" />
                      ) : (
                        <RefreshCwIcon className="size-4" />
                      )}
                      Regenerate
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cover & Logo */}
          <Card className="rounded-xl">
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

          {/* Restaurant Information */}
          <Card className="rounded-xl">
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
