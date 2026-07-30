"use client"

import * as React from "react"
import {
  UserIcon,
  PhoneIcon,
  IdCardIcon,
  BuildingIcon,
  FileTextIcon,
  CheckCircle2Icon,
  ShieldCheckIcon,
} from "lucide-react"

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
import { api, type Restaurant, type KycPayload, type ApiError } from "@/lib/api"
import { toast } from "@/components/ui/toast"

const idTypes = [
  { value: "national_id", label: "National ID" },
  { value: "passport", label: "Passport" },
  { value: "driving_license", label: "Driving License" },
]

const businessTypes = [
  { value: "individual", label: "Individual" },
  { value: "company", label: "Company" },
  { value: "partnership", label: "Partnership" },
]

export default function KycPage() {
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)
  const [form, setForm] = React.useState<KycPayload>({
    owner_name: "",
    owner_phone: "",
    owner_id_type: "national_id",
    owner_id_number: "",
    business_type: "individual",
    tin_number: "",
  })

  React.useEffect(() => {
    api.getRestaurant().then((res) => {
      setRestaurant(res.restaurant)
      if (res.restaurant.owner_name) {
        setForm({
          owner_name: res.restaurant.owner_name,
          owner_phone: res.restaurant.owner_phone || "",
          owner_id_type: res.restaurant.owner_id_type || "national_id",
          owner_id_number: res.restaurant.owner_id_number || "",
          business_type: res.restaurant.business_type || "individual",
          tin_number: res.restaurant.tin_number || "",
        })
      }
      setLoading(false)
    })
  }, [])

  const updateField = (field: keyof KycPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await api.submitKyc(form)
      setRestaurant(res.restaurant)
      toast.add({
        title: "KYC Approved!",
        description: res.message,
        type: "success",
      })
    } catch (err) {
      const error = err as ApiError
      toast.add({
        title: "KYC Submission Failed",
        description: error.errors
          ? Object.values(error.errors).flat().join(" ")
          : error.message,
        type: "error",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading KYC&hellip;</p>
      </div>
    )
  }

  const isApproved = restaurant?.kyc_status === "approved"

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:px-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">KYC Verification</h2>
        <p className="text-muted-foreground">
          Submit your business details to verify your restaurant
        </p>
      </div>

      {/* Status banner */}
      {isApproved ? (
        <Card className="max-w-2xl border-green-600/50 bg-green-50/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-green-600">
              <CheckCircle2Icon className="size-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-green-900">KYC Approved</p>
              <p className="text-sm text-green-700">
                Your restaurant is verified. Your restaurant link is active.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-2xl border-amber-600/50 bg-amber-50/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-600">
              <ShieldCheckIcon className="size-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-amber-900">KYC Required</p>
              <p className="text-sm text-amber-700">
                Please submit your business details below to get your restaurant link.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Restaurant link */}
      {isApproved && restaurant?.restaurant_link && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-base">Your Restaurant Link</CardTitle>
            <CardDescription>
              Share this link with customers so they can view your menu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
              <span className="flex-1 truncate text-sm font-medium text-primary">
                {typeof window !== "undefined" ? window.location.origin : ""}/t/{restaurant.restaurant_link}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/t/${restaurant.restaurant_link}`
                    )
                    toast.add({ title: "Link copied!", type: "success" })
                  }
                }}
              >
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KYC Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
          <CardDescription>
            Fill in all required fields. KYC is auto-approved upon submission.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Owner Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="owner_name">Owner Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="owner_name"
                  type="text"
                  placeholder="John Doe"
                  value={form.owner_name}
                  onChange={(e) => updateField("owner_name", e.target.value)}
                  className="pl-10"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Owner Phone */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="owner_phone">Owner Phone</Label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="owner_phone"
                  type="tel"
                  placeholder="+255 6XX XXX XXX"
                  value={form.owner_phone}
                  onChange={(e) => updateField("owner_phone", e.target.value)}
                  className="pl-10"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            {/* ID Type + ID Number */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="owner_id_type">ID Type</Label>
                <div className="relative">
                  <IdCardIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <select
                    id="owner_id_type"
                    value={form.owner_id_type}
                    onChange={(e) => updateField("owner_id_type", e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                    disabled={submitting}
                  >
                    {idTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="owner_id_number">ID Number</Label>
                <Input
                  id="owner_id_number"
                  type="text"
                  placeholder="12345678"
                  value={form.owner_id_number}
                  onChange={(e) => updateField("owner_id_number", e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Business Type */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="business_type">Business Type</Label>
              <div className="relative">
                <BuildingIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  id="business_type"
                  value={form.business_type}
                  onChange={(e) => updateField("business_type", e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                  disabled={submitting}
                >
                  {businessTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* TIN Number */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="tin_number">TIN Number</Label>
              <div className="relative">
                <FileTextIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="tin_number"
                  type="text"
                  placeholder="123-456-789"
                  value={form.tin_number}
                  onChange={(e) => updateField("tin_number", e.target.value)}
                  className="pl-10"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner className="size-4" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className="size-4" />
                    Submit KYC
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
