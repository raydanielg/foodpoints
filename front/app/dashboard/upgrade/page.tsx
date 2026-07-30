"use client"

import * as React from "react"
import {
  CheckIcon,
  SparklesIcon,
  ZapIcon,
  BuildingIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { api, type Restaurant } from "@/lib/api"

type Plan = {
  id: string
  name: string
  price: string
  period: string
  description: string
  icon: React.ElementType
  features: string[]
  highlight?: boolean
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for small restaurants just getting started",
    icon: SparklesIcon,
    features: [
      "Up to 10 menu items",
      "Up to 5 tables",
      "QR code ordering",
      "Basic dashboard",
      "Email support",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: "25,000",
    period: "TZS / month",
    description: "Great for growing restaurants with more needs",
    icon: ZapIcon,
    features: [
      "Unlimited menu items",
      "Up to 20 tables",
      "QR code ordering",
      "Advanced analytics",
      "Staff management",
      "Kitchen display",
      "Split payments",
      "Priority support",
    ],
    highlight: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "60,000",
    period: "TZS / month",
    description: "For large restaurants with advanced requirements",
    icon: BuildingIcon,
    features: [
      "Everything in Standard",
      "Unlimited tables",
      "Multi-branch support",
      "Custom branding",
      "API access",
      "Advanced reports",
      "Dedicated manager",
      "24/7 phone support",
    ],
  },
]

export default function UpgradePage() {
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [selectedPlan, setSelectedPlan] = React.useState<Plan | null>(null)
  const [upgrading, setUpgrading] = React.useState(false)
  const [upgraded, setUpgraded] = React.useState(false)

  React.useEffect(() => {
    api.getRestaurant().then((res) => {
      setRestaurant(res.restaurant)
      setLoading(false)
    })
  }, [])

  const handleUpgrade = async () => {
    if (!selectedPlan) return
    setUpgrading(true)
    try {
      await api.updateSubscription({ subscription_status: "active" })
      setUpgraded(true)
      setTimeout(() => {
        setSelectedPlan(null)
        setUpgraded(false)
      }, 2500)
    } catch {
    } finally {
      setUpgrading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading plans&hellip;</p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-6 px-4 lg:px-6">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold tracking-tight">Upgrade Your Plan</h2>
        <p className="mt-1 max-w-lg text-muted-foreground">
          Choose the plan that fits your restaurant. Upgrade or downgrade anytime.
        </p>
        {restaurant && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Current status:</span>
            <Badge
              variant={restaurant.subscription_status === "active" ? "default" : "secondary"}
              className="capitalize"
            >
              {restaurant.subscription_status}
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={
              plan.highlight
                ? "border-primary ring-2 ring-primary/20"
                : ""
            }
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <plan.icon className="size-5" />
                </div>
                {plan.highlight && (
                  <Badge>Most Popular</Badge>
                )}
              </div>
              <CardTitle className="mt-2">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckIcon className="size-4 text-emerald-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full"
                variant={plan.highlight ? "default" : "outline"}
                onClick={() => setSelectedPlan(plan)}
                disabled={plan.id === "starter"}
              >
                {plan.id === "starter" ? "Current Plan" : "Choose Plan"}
                {plan.id !== "starter" && <ArrowRightIcon className="size-4" />}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent>
          {upgraded ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircleIcon className="size-8 text-emerald-600" />
              </div>
              <DialogTitle>Upgrade Successful!</DialogTitle>
              <DialogDescription>
                Your subscription has been activated. Enjoy your new features!
              </DialogDescription>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Confirm Upgrade</DialogTitle>
                <DialogDescription>
                  You are about to upgrade to the{" "}
                  <span className="font-medium text-foreground">
                    {selectedPlan?.name}
                  </span>{" "}
                  plan at{" "}
                  <span className="font-medium text-foreground">
                    {selectedPlan?.price} {selectedPlan?.period}
                  </span>
                  .
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-lg border bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">
                  This is a demo upgrade. In production, you would be redirected to
                  a payment gateway to complete the transaction.
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedPlan(null)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpgrade} disabled={upgrading}>
                  {upgrading ? (
                    <Spinner className="size-4" />
                  ) : (
                    <CheckIcon className="size-4" />
                  )}
                  Confirm Upgrade
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
