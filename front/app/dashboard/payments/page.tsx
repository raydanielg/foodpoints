"use client"

import * as React from "react"
import { BanknoteIcon, CheckIcon, ClockIcon, TrendingUpIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { api, type Payment } from "@/lib/api"
import { PaymentsDataTable } from "@/components/payments-data-table"
import { toast } from "@/components/ui/toast"

function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "0"
  return num.toLocaleString()
}

export default function PaymentsPage() {
  const [payments, setPayments] = React.useState<Payment[]>([])
  const [loading, setLoading] = React.useState(true)

  const load = () => {
    api.getPayments().then((res) => setPayments(res.payments)).finally(() => setLoading(false))
  }

  React.useEffect(() => {
    load()
  }, [])

  const handleConfirmCash = async (id: number) => {
    try {
      await api.confirmCash(id)
      toast.add({ title: "Payment confirmed", description: "Cash payment has been confirmed.", type: "success" })
      load()
    } catch (err: any) {
      toast.add({ title: "Failed to confirm", description: err?.message || "Something went wrong", type: "error" })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading payments&hellip;</p>
      </div>
    )
  }

  const totalAmount = payments.filter(p => p.status === "completed").reduce((sum, p) => sum + parseFloat(p.amount), 0)
  const pendingCount = payments.filter(p => p.status === "pending").length
  const completedCount = payments.filter(p => p.status === "completed").length
  const todayPayments = payments.filter(p => {
    const today = new Date().toDateString()
    return new Date(p.created_at).toDateString() === today
  })

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:gap-6 lg:px-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
        <p className="text-muted-foreground">Track and manage all customer payments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
                <BanknoteIcon className="size-4" />
              </span>
              Total Revenue
            </CardDescription>
            <CardTitle className="text-xl font-bold tabular-nums">{formatCurrency(totalAmount)} TZS</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600">
                <TrendingUpIcon className="size-4" />
              </span>
              Today&apos;s Payments
            </CardDescription>
            <CardTitle className="text-xl font-bold tabular-nums">{todayPayments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
                <CheckIcon className="size-4" />
              </span>
              Completed
            </CardDescription>
            <CardTitle className="text-xl font-bold tabular-nums">{completedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600">
                <ClockIcon className="size-4" />
              </span>
              Pending
            </CardDescription>
            <CardTitle className="text-xl font-bold tabular-nums">{pendingCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="p-0">
        <CardContent className="p-0">
          <PaymentsDataTable data={payments} onConfirmCash={handleConfirmCash} />
        </CardContent>
      </Card>
    </div>
  )
}
