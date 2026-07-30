"use client"

import * as React from "react"
import {
  CheckIcon,
  SparklesIcon,
  ZapIcon,
  BuildingIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SmartphoneIcon,
  CreditCardIcon,
  CrownIcon,
  CalendarIcon,
  ClockIcon,
  XCircleIcon,
  LoaderIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item"
import { api, type Restaurant, type Plan } from "@/lib/api"
import { toast } from "@/components/ui/toast"

function formatPrice(price: string) {
  const num = parseFloat(price)
  if (isNaN(num) || num === 0) return "Free"
  return num.toLocaleString()
}

function getPlanIcon(name: string) {
  const lower = name.toLowerCase()
  if (lower.includes("starter") || lower.includes("free") || lower.includes("basic"))
    return SparklesIcon
  if (lower.includes("standard") || lower.includes("pro") || lower.includes("plus"))
    return ZapIcon
  if (lower.includes("premium") || lower.includes("enterprise") || lower.includes("ultimate"))
    return CrownIcon
  return BuildingIcon
}

export default function UpgradePage() {
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null)
  const [plans, setPlans] = React.useState<Plan[]>([])
  const [currentPlanId, setCurrentPlanId] = React.useState<number | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [selectedPlan, setSelectedPlan] = React.useState<Plan | null>(null)
  const [processing, setProcessing] = React.useState(false)
  const [paymentMethod, setPaymentMethod] = React.useState<"mobile_money" | "card">("mobile_money")
  const [phone, setPhone] = React.useState("")
  const [paymentStatus, setPaymentStatus] = React.useState<"idle" | "pending" | "success" | "failed">("idle")
  const [paymentMessage, setPaymentMessage] = React.useState("")
  const pollRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const load = () => {
    Promise.all([api.getRestaurant(), api.getPlans()])
      .then(([restRes, plansRes]) => {
        setRestaurant(restRes.restaurant)
        setPlans(plansRes.plans)
        setCurrentPlanId(plansRes.current_plan_id)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  React.useEffect(() => {
    load()
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  const handleSubscribe = async () => {
    if (!selectedPlan) return
    setProcessing(true)
    setPaymentStatus("idle")
    try {
      const res = await api.subscribeToPlan({
        plan_id: selectedPlan.id,
        payment_method: paymentMethod,
        phone: paymentMethod === "mobile_money" ? phone : undefined,
      })

      // Free plan — immediate activation
      if (res.restaurant) {
        setPaymentStatus("success")
        toast.add({ title: "Plan activated!", description: `You are now on ${selectedPlan.name}.`, type: "success" })
        setTimeout(() => {
          setSelectedPlan(null)
          setPaymentStatus("idle")
          setPhone("")
          load()
        }, 2500)
        return
      }

      // Card payment — redirect to checkout
      if (res.checkout_url) {
        setPaymentStatus("pending")
        setPaymentMessage("Redirecting to payment page...")
        window.open(res.checkout_url, "_blank")
        // Start polling
        if (res.payment_id) startPolling(res.payment_id)
        return
      }

      // Mobile money — poll for status
      if (res.payment_id) {
        setPaymentStatus("pending")
        setPaymentMessage(res.message || "Please complete the payment on your phone.")
        startPolling(res.payment_id)
      }
    } catch (err: any) {
      setPaymentStatus("failed")
      setPaymentMessage(err?.message || "Something went wrong")
      toast.add({ title: "Payment failed", description: err?.message || "Something went wrong", type: "error" })
    } finally {
      setProcessing(false)
    }
  }

  const startPolling = (paymentId: number) => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.checkSubscriptionPaymentStatus(paymentId)
        if (res.status === "completed") {
          if (pollRef.current) clearInterval(pollRef.current)
          setPaymentStatus("success")
          setPaymentMessage("Payment received! Your plan is now active.")
          toast.add({ title: "Payment successful!", description: "Your plan has been activated.", type: "success" })
          setTimeout(() => {
            setSelectedPlan(null)
            setPaymentStatus("idle")
            setPhone("")
            load()
          }, 2500)
        } else if (res.status === "failed") {
          if (pollRef.current) clearInterval(pollRef.current)
          setPaymentStatus("failed")
          setPaymentMessage("Payment failed. Please try again.")
        }
      } catch {
        // Keep polling on error
      }
    }, 5000)
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading plans&hellip;</p>
      </div>
    )
  }

  const currentPlan = plans.find((p) => p.id === currentPlanId)
  const isFree = (p: Plan) => parseFloat(p.price) === 0

  return (
    <div className="flex w-full flex-col gap-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <CrownIcon className="size-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Upgrade Your Plan</h2>
        <p className="mt-1 max-w-lg text-muted-foreground">
          Choose the plan that fits your restaurant. Upgrade or downgrade anytime.
        </p>
        {restaurant && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Current:</span>
            <Badge
              variant={restaurant.subscription_status === "active" ? "default" : "secondary"}
              className="capitalize"
            >
              {currentPlan?.name || restaurant.subscription_status}
            </Badge>
            {restaurant.subscription_expires_at && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarIcon className="size-3" />
                Expires {new Date(restaurant.subscription_expires_at).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Plans Grid */}
      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-lg font-medium">No plans available</p>
          <p className="text-sm text-muted-foreground">
            Please contact support to set up a subscription plan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((plan, index) => {
            const Icon = getPlanIcon(plan.name)
            const isCurrent = plan.id === currentPlanId
            const isPopular = index === 1 || (index === 0 && plans.length === 1)

            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden rounded-xl transition-all ${
                  isPopular && !isCurrent
                    ? "border-primary ring-2 ring-primary/20 shadow-lg"
                    : isCurrent
                      ? "border-emerald-300 ring-1 ring-emerald-200"
                      : "hover:border-muted-foreground/30"
                }`}
              >
                {isPopular && !isCurrent && (
                  <div className="absolute right-0 top-0 rounded-bl-xl bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute right-0 top-0 rounded-bl-xl bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                    Current Plan
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="mt-2 text-lg">{plan.name}</CardTitle>
                  {plan.description && (
                    <CardDescription className="text-xs leading-relaxed">
                      {plan.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold tabular-nums">
                      {formatPrice(plan.price)}
                    </span>
                    {!isFree(plan) && (
                      <span className="text-sm text-muted-foreground">
                        {plan.currency} / {plan.duration_days} days
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  {plan.features && plan.features.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    className="w-full rounded-xl"
                    variant={isCurrent ? "outline" : isPopular ? "default" : "outline"}
                    onClick={() => !isCurrent && setSelectedPlan(plan)}
                    disabled={isCurrent}
                  >
                    {isCurrent ? (
                      <>
                        <CheckCircleIcon className="size-4" />
                        Active Plan
                      </>
                    ) : (
                      <>
                        {isFree(plan) ? "Get Started" : "Choose Plan"}
                        <ArrowRightIcon className="size-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Subscribe Dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={(open) => {
        if (!open) {
          if (pollRef.current) clearInterval(pollRef.current)
          setSelectedPlan(null)
          setPaymentStatus("idle")
          setPhone("")
        }
      }}>
        <DialogContent>
          {paymentStatus === "success" ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircleIcon className="size-8 text-emerald-600" />
              </div>
              <DialogTitle>Subscription Active!</DialogTitle>
              <DialogDescription>
                Your payment has been received and your plan is now active. Enjoy your new features!
              </DialogDescription>
            </div>
          ) : paymentStatus === "pending" ? (
            <div className="flex flex-col gap-4 py-4">
              <DialogTitle>Payment in Progress</DialogTitle>
              <DialogDescription>
                {paymentMessage || "Please complete the payment on your phone. We are checking your payment status automatically..."}
              </DialogDescription>
              <div className="flex w-full flex-col gap-2 [--radius:1rem]">
                <Item variant="muted">
                  <ItemMedia>
                    <Spinner className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="line-clamp-1">
                      {selectedPlan?.name} — Processing payment...
                    </ItemTitle>
                    <ItemDescription className="text-xs">
                      {paymentMethod === "mobile_money" ? "Mobile Money" : "Card"} • Waiting for confirmation
                    </ItemDescription>
                  </ItemContent>
                  <ItemContent className="flex-none justify-end">
                    <span className="text-sm font-semibold tabular-nums">
                      {selectedPlan && formatPrice(selectedPlan.price)} {selectedPlan?.currency}
                    </span>
                  </ItemContent>
                </Item>
                <div className="flex items-center gap-2 px-3 text-xs text-muted-foreground">
                  <ClockIcon className="size-3.5 animate-pulse" />
                  Checking payment status automatically...
                </div>
              </div>
            </div>
          ) : paymentStatus === "failed" ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
                <XCircleIcon className="size-8 text-red-600" />
              </div>
              <DialogTitle>Payment Failed</DialogTitle>
              <DialogDescription>
                {paymentMessage || "Your payment could not be processed. Please try again."}
              </DialogDescription>
              <Button
                onClick={() => {
                  setPaymentStatus("idle")
                  setPaymentMessage("")
                }}
                className="rounded-xl"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Subscribe to {selectedPlan?.name}</DialogTitle>
                <DialogDescription>
                  You are subscribing to the{" "}
                  <span className="font-medium text-foreground">{selectedPlan?.name}</span> plan
                  {selectedPlan && !isFree(selectedPlan) && (
                    <> for <span className="font-medium text-foreground">{formatPrice(selectedPlan.price)} {selectedPlan.currency}</span> / {selectedPlan.duration_days} days</>
                  )}.
                </DialogDescription>
              </DialogHeader>

              {/* Payment Method */}
              {selectedPlan && !isFree(selectedPlan) ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium">Payment Method</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("mobile_money")}
                        className={`flex items-center gap-2 rounded-xl border p-3 transition-all ${
                          paymentMethod === "mobile_money"
                            ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                            : "hover:border-muted-foreground/30"
                        }`}
                      >
                        <SmartphoneIcon className="size-5 text-blue-500" />
                        <div className="text-left">
                          <p className="text-sm font-medium">Mobile Money</p>
                          <p className="text-xs text-muted-foreground">M-Pesa, Tigo Pesa, Airtel</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`flex items-center gap-2 rounded-xl border p-3 transition-all ${
                          paymentMethod === "card"
                            ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                            : "hover:border-muted-foreground/30"
                        }`}
                      >
                        <CreditCardIcon className="size-5 text-purple-500" />
                        <div className="text-left">
                          <p className="text-sm font-medium">Card</p>
                          <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Phone for Mobile Money */}
                  {paymentMethod === "mobile_money" && (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0712 345 678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="rounded-xl"
                      />
                      <p className="text-xs text-muted-foreground">
                        You will receive a USSD prompt to confirm payment.
                      </p>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="rounded-xl border bg-muted/50 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Plan</span>
                      <span className="font-medium">{selectedPlan?.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{selectedPlan?.duration_days} days</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-bold tabular-nums">
                        {selectedPlan && formatPrice(selectedPlan.price)} {selectedPlan?.currency}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border bg-emerald-50/50 p-3 text-sm text-emerald-700">
                  This is a free plan. Click confirm to activate it.
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedPlan(null)}
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubscribe} disabled={processing || (!!selectedPlan && !isFree(selectedPlan) && paymentMethod === "mobile_money" && !phone)}>
                  {processing ? (
                    <Spinner className="size-4" />
                  ) : (
                    <CheckIcon className="size-4" />
                  )}
                  {selectedPlan && isFree(selectedPlan) ? "Activate Free Plan" : `Pay ${selectedPlan ? formatPrice(selectedPlan.price) : ""} ${selectedPlan?.currency}`}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
