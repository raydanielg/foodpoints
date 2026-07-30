"use client"

import * as React from "react"
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  PhoneIcon,
  UserIcon,
  UtensilsCrossedIcon,
  QrCodeIcon,
  WalletIcon,
  ChefHatIcon,
  BarChart3Icon,
} from "lucide-react"
import Image from "next/image"

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
import { api, setToken, type ApiError } from "@/lib/api"
import { toast } from "@/components/ui/toast"

type Mode = "login" | "register"

export default function AuthPage() {
  const [mode, setMode] = React.useState<Mode>("login")
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const [form, setForm] = React.useState({
    name: "",
    restaurant_name: "",
    phone: "",
    password: "",
    password_confirmation: "",
  })

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const switchMode = (newMode: Mode) => {
    setMode(newMode)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "register") {
        const res = await api.register({
          name: form.name,
          phone: form.phone,
          password: form.password,
          password_confirmation: form.password_confirmation,
          restaurant_name: form.restaurant_name,
        })
        setToken(res.token)
        window.location.href = "/dashboard"
      } else {
        const res = await api.login({
          phone: form.phone,
          password: form.password,
        })
        setToken(res.token)
        window.location.href = "/dashboard"
      }
    } catch (err) {
      const apiErr = err as ApiError
      toast.add({
        title: "Authentication Error",
        description: apiErr.errors
          ? Object.values(apiErr.errors).flat().join(" ")
          : apiErr.message,
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Branding */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-12 lg:flex">
        {/* Cover image */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/3394.jpg"
            alt="Restaurant"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />
        </div>

        <div className="relative z-10 flex items-center gap-3 text-white">
          <Image
            src="/food-irradiation.png"
            alt="FoodPoint"
            width={44}
            height={44}
            className="rounded-xl bg-white/10 p-1 backdrop-blur-sm"
            priority
          />
          <div>
            <p className="text-lg font-semibold tracking-tight">
              FoodPoint
            </p>
            <p className="text-sm text-white/70">Restaurant Management Platform</p>
          </div>
        </div>

        <div className="relative z-10 text-white">
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight">
            The future of restaurant management
          </h1>
          <p className="mb-8 max-w-md text-lg text-white/70">
            QR-based ordering, split payments, kitchen display, and
            powerful management dashboards — all in one platform.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                <QrCodeIcon className="size-5" />
              </div>
              <div>
                <p className="font-semibold">QR Code Ordering</p>
                <p className="text-sm text-white/70">Customers scan &amp; order instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                <WalletIcon className="size-5" />
              </div>
              <div>
                <p className="font-semibold">Split Payments</p>
                <p className="text-sm text-white/70">Let customers split bills easily</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                <ChefHatIcon className="size-5" />
              </div>
              <div>
                <p className="font-semibold">Kitchen Display</p>
                <p className="text-sm text-white/70">Real-time order management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                <BarChart3Icon className="size-5" />
              </div>
              <div>
                <p className="font-semibold">Analytics Dashboard</p>
                <p className="text-sm text-white/70">Track revenue and performance</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex gap-8 text-white">
          <div>
            <p className="text-3xl font-bold">500+</p>
            <p className="text-sm text-white/70">Restaurants</p>
          </div>
          <div>
            <p className="text-3xl font-bold">99.9%</p>
            <p className="text-sm text-white/70">Uptime</p>
          </div>
          <div>
            <p className="text-3xl font-bold">24/7</p>
            <p className="text-sm text-white/70">Support</p>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex w-full flex-col items-center justify-center bg-background p-4 sm:p-6 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <Image
              src="/food-irradiation.png"
              alt="FoodPoint"
              width={40}
              height={40}
              className="rounded-xl"
              priority
            />
            <div>
              <p className="text-base font-semibold tracking-tight">
                FoodPoint
              </p>
              <p className="text-xs text-muted-foreground">Restaurant Management</p>
            </div>
          </div>

          <Card>
            <CardHeader className="mb-6">
              <CardTitle className="text-2xl">
                {mode === "login" ? "Sign in" : "Create account"}
              </CardTitle>
              <CardDescription>
                {mode === "login"
                  ? "Enter your credentials to access your dashboard"
                  : "Fill in the form below to create your account"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Mode switcher */}
              <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
                    mode === "login"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
                    mode === "register"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {mode === "register" && (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                {mode === "register" && (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="restaurant_name">Restaurant Name</Label>
                    <div className="relative">
                      <UtensilsCrossedIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="restaurant_name"
                        type="text"
                        placeholder="My Restaurant"
                        value={form.restaurant_name}
                        onChange={(e) => updateField("restaurant_name", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="2557XXXXXXXX"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="pl-10"
                      required
                      pattern="^255\d{9}$"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Must start with 255 followed by 9 digits</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      className="px-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="size-4" />
                      ) : (
                        <EyeIcon className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                {mode === "register" && (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password_confirmation">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password_confirmation"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.password_confirmation}
                        onChange={(e) =>
                          updateField("password_confirmation", e.target.value)
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                {mode === "login" && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-border accent-primary"
                      />
                      Remember me
                    </label>
                    <button
                      type="button"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="mt-2 w-full"
                  disabled={loading}
                >
                  {loading && <Spinner className="size-4" />}
                  {mode === "login" ? "Sign In" : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "login" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("register")}
                      className="font-medium text-primary hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="font-medium text-primary hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="/terms" className="font-medium text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="font-medium text-primary hover:underline">
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}
