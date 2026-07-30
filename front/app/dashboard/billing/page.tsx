"use client"

import * as React from "react"
import Link from "next/link"
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ReceiptIcon,
  ArrowUpRightIcon,
  SparklesIcon,
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
import { api, type Restaurant, type Payment } from "@/lib/api"

function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "0"
  return num.toLocaleString()
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const planConfig: Record<
  string,
  { label: string; color: string; description: string }
> = {
  active: {
    label: "Active",
    color: "bg-emerald-100 text-emerald-700",
    description: "Your subscription is active and all features are available.",
  },
  suspended: {
    label: "Suspended",
    color: "bg-amber-100 text-amber-700",
    description: "Your subscription is suspended. Some features may be limited.",
  },
  pending: {
    label: "Pending",
    color: "bg-blue-100 text-blue-700",
    description: "Your subscription is pending activation.",
  },
}

export default function BillingPage() {
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null)
  const [payments, setPayments] = React.useState<Payment[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    Promise.all([api.getRestaurant(), api.getPayments()])
      .then(([restRes, payRes]) => {
        setRestaurant(restRes.restaurant)
        setPayments(payRes.payments)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading billing&hellip;</p>
      </div>
    )
  }

  const plan = restaurant
    ? planConfig[restaurant.subscription_status] || planConfig.pending
    : planConfig.pending

  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + parseFloat(p.amount), 0)

  const pendingPayments = payments.filter((p) => p.status === "pending")
  const failedPayments = payments.filter((p) => p.status === "failed")

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:px-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
        <p className="text-muted-foreground">
          Manage your subscription and view payment history
        </p>
      </div>

      {/* Current plan */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="size-5 text-primary" />
            Current Plan
          </CardTitle>
          <CardDescription>Your subscription status</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">Standard Plan</span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${plan.color}`}
                >
                  {plan.label}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {plan.description}
              </span>
            </div>
            <Link href="/dashboard/upgrade">
              <Button size="sm">
                <ArrowUpRightIcon className="size-4" />
                Upgrade
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1 rounded-lg border p-3">
              <span className="text-xs text-muted-foreground">Total Revenue</span>
              <span className="text-lg font-bold tabular-nums">
                {formatCurrency(totalRevenue)}{" "}
                {restaurant?.currency || "TZS"}
              </span>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border p-3">
              <span className="text-xs text-muted-foreground">Pending</span>
              <span className="text-lg font-bold tabular-nums text-amber-600">
                {pendingPayments.length}
              </span>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border p-3">
              <span className="text-xs text-muted-foreground">Failed</span>
              <span className="text-lg font-bold tabular-nums text-red-600">
                {failedPayments.length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment history */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ReceiptIcon className="size-5" />
            Payment History
          </CardTitle>
          <CardDescription>Recent customer payments</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No payments yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {payments.slice(0, 15).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-9 items-center justify-center rounded-lg ${
                        p.status === "completed"
                          ? "bg-emerald-100 text-emerald-600"
                          : p.status === "pending"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-red-100 text-red-600"
                      }`}
                    >
                      {p.status === "completed" ? (
                        <CheckCircleIcon className="size-4" />
                      ) : p.status === "pending" ? (
                        <ClockIcon className="size-4" />
                      ) : (
                        <XCircleIcon className="size-4" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium tabular-nums">
                        {formatCurrency(p.amount)} {restaurant?.currency || "TZS"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {p.method.replace("_", " ")} · {formatTime(p.created_at)}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={p.status === "completed" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {p.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
