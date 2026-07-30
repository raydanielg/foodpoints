"use client"

import * as React from "react"
import {
  StoreIcon,
  ShieldCheckIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
  ArrowLeftIcon,
  UserIcon,
  PhoneIcon,
  IdCardIcon,
  BuildingIcon,
  FileTextIcon,
  MapPinIcon,
  CoinsIcon,
  ImageIcon,
  LinkIcon,
  CopyIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"

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
import { api, imageUrl, type Restaurant, type KycPayload, type ApiError } from "@/lib/api"
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

const steps = [
  {
    id: 1,
    title: "Restaurant Details",
    description: "Set up your restaurant profile with name, contact info, and branding",
    icon: StoreIcon,
  },
  {
    id: 2,
    title: "KYC Verification",
    description: "Verify your identity and business to activate your restaurant link",
    icon: ShieldCheckIcon,
  },
  {
    id: 3,
    title: "Your Link is Ready",
    description: "Get your public restaurant link to share with customers",
    icon: LinkIcon,
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [currentStep, setCurrentStep] = React.useState(1)
  const [savingDetails, setSavingDetails] = React.useState(false)
  const [submittingKyc, setSubmittingKyc] = React.useState(false)

  const [details, setDetails] = React.useState({
    name: "",
    address: "",
    phone: "",
    currency: "TZS",
    vat_percent: "18",
    logo_url: "" as string | null,
    cover_url: "" as string | null,
  })

  const [kyc, setKyc] = React.useState<KycPayload>({
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
      setDetails({
        name: res.restaurant.name || "",
        address: res.restaurant.address || "",
        phone: res.restaurant.phone || "",
        currency: res.restaurant.currency || "TZS",
        vat_percent: res.restaurant.vat_percent || "18",
        logo_url: res.restaurant.logo_url,
        cover_url: res.restaurant.cover_url,
      })
      if (res.restaurant.owner_name) {
        setKyc({
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

  const updateDetail = (field: keyof typeof details, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }))
  }

  const updateKycField = (field: keyof KycPayload, value: string) => {
    setKyc((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveDetails = async () => {
    if (!details.name.trim()) {
      toast.add({ title: "Restaurant name is required", type: "warning" })
      return
    }
    setSavingDetails(true)
    try {
      const res = await api.updateRestaurant({
        name: details.name,
        address: details.address,
        phone: details.phone,
        currency: details.currency,
        vat_percent: details.vat_percent,
        logo_url: details.logo_url,
        cover_url: details.cover_url,
      })
      setRestaurant(res.restaurant)
      toast.add({ title: "Restaurant details saved!", type: "success" })
      setCurrentStep(2)
    } catch (err) {
      const error = err as ApiError
      toast.add({
        title: "Failed to save details",
        description: error.errors
          ? Object.values(error.errors).flat().join(" ")
          : error.message,
        type: "error",
      })
    } finally {
      setSavingDetails(false)
    }
  }

  const handleSubmitKyc = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingKyc(true)
    try {
      const res = await api.submitKyc(kyc)
      setRestaurant(res.restaurant)
      toast.add({
        title: "KYC Approved!",
        description: res.message,
        type: "success",
      })
      setCurrentStep(3)
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
      setSubmittingKyc(false)
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

  const handleGoToDashboard = () => {
    router.push("/dashboard")
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading onboarding&hellip;</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left column — Steps & Progress */}
      <div className="hidden w-[380px] shrink-0 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 lg:flex">
        <div>
          {/* Logo */}
          <div className="mb-10 flex items-center gap-3 text-white">
            <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <StoreIcon className="size-6" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">FoodPoint</p>
              <p className="text-sm text-white/60">Onboarding</p>
            </div>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-1">
            {steps.map((step, idx) => {
              const isComplete = currentStep > step.id
              const isActive = currentStep === step.id
              const Icon = step.icon

              return (
                <div key={step.id}>
                  <div
                    className={
                      "flex items-start gap-4 rounded-xl p-4 transition-all " +
                      (isActive
                        ? "bg-white/10 backdrop-blur-sm"
                        : isComplete
                          ? "opacity-70"
                          : "opacity-40")
                    }
                  >
                    <div
                      className={
                        "flex size-10 shrink-0 items-center justify-center rounded-xl transition-all " +
                        (isComplete
                          ? "bg-green-600"
                          : isActive
                            ? "bg-primary"
                            : "bg-white/10")
                      }
                    >
                      {isComplete ? (
                        <CheckCircle2Icon className="size-5 text-white" />
                      ) : (
                        <Icon className="size-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-white/60">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Connector line */}
                  {idx < steps.length - 1 && (
                    <div className="ml-9 h-6 w-0.5 bg-white/10" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom info */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs leading-relaxed text-white/60">
            Complete all steps to activate your restaurant and start receiving
            orders from customers via your public link.
          </p>
        </div>
      </div>

      {/* Right column — Content */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Mobile header */}
        <div className="border-b bg-gradient-to-r from-slate-900 to-slate-800 p-4 lg:hidden">
          <div className="flex items-center gap-3 text-white">
            <div className="flex size-9 items-center justify-center rounded-lg bg-white/10">
              <StoreIcon className="size-5" />
            </div>
            <div>
              <p className="text-base font-semibold">FoodPoint Onboarding</p>
              <p className="text-xs text-white/60">
                Step {currentStep} of {steps.length}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl flex-1 p-6 lg:p-10">
          {/* Step indicator (mobile) */}
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            {steps.map((step) => (
              <div
                key={step.id}
                className={
                  "h-1.5 flex-1 rounded-full transition-all " +
                  (currentStep >= step.id ? "bg-primary" : "bg-muted")
                }
              />
            ))}
          </div>

          {/* Step 1: Restaurant Details */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                    1
                  </span>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Restaurant Details
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  Set up your restaurant profile. This information will be visible
                  to your customers.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Branding</CardTitle>
                  <CardDescription>
                    Upload your logo and cover image
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <ImageUpload
                    value={imageUrl(details.cover_url)}
                    type="cover"
                    shape="wide"
                    label="Cover Image"
                    onChange={(url) => updateDetail("cover_url", url)}
                  />
                  <ImageUpload
                    value={imageUrl(details.logo_url)}
                    type="logo"
                    shape="square"
                    label="Logo"
                    onChange={(url) => updateDetail("logo_url", url)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Information</CardTitle>
                  <CardDescription>
                    Basic details about your restaurant
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Restaurant Name</Label>
                    <div className="relative">
                      <StoreIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        value={details.name}
                        onChange={(e) => updateDetail("name", e.target.value)}
                        className="pl-10"
                        placeholder="My Restaurant"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="address"
                        value={details.address}
                        onChange={(e) => updateDetail("address", e.target.value)}
                        className="pl-10"
                        placeholder="123 Main Street, Dar es Salaam"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={details.phone}
                        onChange={(e) => updateDetail("phone", e.target.value)}
                        className="pl-10"
                        placeholder="+255 6XX XXX XXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="currency">Currency</Label>
                      <div className="relative">
                        <CoinsIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="currency"
                          value={details.currency}
                          onChange={(e) => updateDetail("currency", e.target.value)}
                          className="pl-10"
                          placeholder="TZS"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="vat">VAT (%)</Label>
                      <Input
                        id="vat"
                        type="number"
                        value={details.vat_percent}
                        onChange={(e) => updateDetail("vat_percent", e.target.value)}
                        placeholder="18"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSaveDetails} disabled={savingDetails}>
                  {savingDetails ? (
                    <>
                      <Spinner className="size-4" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Continue to KYC
                      <ArrowRightIcon className="size-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: KYC Verification */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                    2
                  </span>
                  <h1 className="text-2xl font-bold tracking-tight">
                    KYC Verification
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  Verify your identity and business. This is required to activate
                  your restaurant link. KYC is auto-approved upon submission.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Owner Identity</CardTitle>
                  <CardDescription>
                    Information about the restaurant owner
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitKyc} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="owner_name">Owner Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="owner_name"
                          type="text"
                          placeholder="John Doe"
                          value={kyc.owner_name}
                          onChange={(e) => updateKycField("owner_name", e.target.value)}
                          className="pl-10"
                          required
                          disabled={submittingKyc}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="owner_phone">Owner Phone</Label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="owner_phone"
                          type="tel"
                          placeholder="+255 6XX XXX XXX"
                          value={kyc.owner_phone}
                          onChange={(e) => updateKycField("owner_phone", e.target.value)}
                          className="pl-10"
                          required
                          disabled={submittingKyc}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="owner_id_type">ID Type</Label>
                        <div className="relative">
                          <IdCardIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <select
                            id="owner_id_type"
                            value={kyc.owner_id_type}
                            onChange={(e) => updateKycField("owner_id_type", e.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            required
                            disabled={submittingKyc}
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
                          value={kyc.owner_id_number}
                          onChange={(e) => updateKycField("owner_id_number", e.target.value)}
                          required
                          disabled={submittingKyc}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="business_type">Business Type</Label>
                      <div className="relative">
                        <BuildingIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <select
                          id="business_type"
                          value={kyc.business_type}
                          onChange={(e) => updateKycField("business_type", e.target.value)}
                          className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          required
                          disabled={submittingKyc}
                        >
                          {businessTypes.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="tin_number">TIN Number</Label>
                      <div className="relative">
                        <FileTextIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="tin_number"
                          type="text"
                          placeholder="123-456-789"
                          value={kyc.tin_number}
                          onChange={(e) => updateKycField("tin_number", e.target.value)}
                          className="pl-10"
                          required
                          disabled={submittingKyc}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setCurrentStep(1)}
                        disabled={submittingKyc}
                      >
                        <ArrowLeftIcon className="size-4" />
                        Back
                      </Button>
                      <Button type="submit" disabled={submittingKyc}>
                        {submittingKyc ? (
                          <>
                            <Spinner className="size-4" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <ShieldCheckIcon className="size-4" />
                            Submit &amp; Verify
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Success & Link */}
          {currentStep === 3 && restaurant && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-4 pt-6 text-center">
                <div className="flex size-20 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2Icon className="size-10 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    You&apos;re all set!
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your restaurant is verified and your link is active.
                  </p>
                </div>
              </div>

              <Card className="border-green-600/30 bg-green-50/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <LinkIcon className="size-4 text-green-600" />
                    Your Restaurant Link
                  </CardTitle>
                  <CardDescription>
                    Share this link with customers so they can view your menu and
                    place orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 rounded-lg border bg-background p-3">
                    <span className="flex-1 truncate text-sm font-medium text-primary">
                      {typeof window !== "undefined" ? window.location.origin : ""}/t/{restaurant.restaurant_link}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyLink}
                      className="shrink-0"
                    >
                      <CopyIcon className="size-4" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center pt-2">
                <Button onClick={handleGoToDashboard} size="lg">
                  Go to Dashboard
                  <ArrowRightIcon className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
