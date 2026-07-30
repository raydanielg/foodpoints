"use client"

import * as React from "react"
import {
  BanknoteIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownToLineIcon,
  PercentIcon,
  AlertCircleIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { api, type Withdrawal, type RevenueData, type PayoutSettings } from "@/lib/api"
import { toast } from "@/components/ui/toast"

function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "0"
  return num.toLocaleString()
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function WithdrawalsPage() {
  const router = useRouter()
  const [withdrawals, setWithdrawals] = React.useState<Withdrawal[]>([])
  const [revenue, setRevenue] = React.useState<RevenueData | null>(null)
  const [payout, setPayout] = React.useState<PayoutSettings | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [amount, setAmount] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)

  const load = React.useCallback(() => {
    Promise.all([api.getWithdrawals(), api.getRevenue(), api.getPayoutSettings()])
      .then(([wRes, rRes, pRes]) => {
        setWithdrawals(wRes.withdrawals)
        setRevenue(rRes.revenue)
        setPayout(pRes.payout)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  const handleWithdraw = async () => {
    const amt = parseFloat(amount)
    if (!amt || amt < 1000) {
      toast({ title: "Invalid amount", description: "Minimum withdrawal is 1,000 TZS", variant: "error" })
      return
    }

    if (revenue && amt > parseFloat(revenue.available_balance)) {
      toast({ title: "Insufficient balance", description: `Your available balance is ${formatCurrency(revenue.available_balance)} TZS`, variant: "error" })
      return
    }

    if (!payout?.payout_recipient_name) {
      toast({ title: "Payout settings required", description: "Please configure your payout settings first.", variant: "error" })
      router.push("/dashboard/payout-settings")
      return
    }

    setSubmitting(true)
    try {
      const res = await api.requestWithdrawal({ amount: amt })
      toast({ title: "Withdrawal initiated", description: res.message, variant: "success" })
      setDialogOpen(false)
      setAmount("")
      load()
    } catch (err: any) {
      toast({ title: "Withdrawal failed", description: err?.message || "Something went wrong", variant: "error" })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading withdrawals&hellip;</p>
      </div>
    )
  }

  const availableBalance = revenue ? parseFloat(revenue.available_balance) : 0
  const hasPayoutSettings = payout?.payout_recipient_name

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:gap-6 lg:px-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Withdrawals</h2>
        <p className="text-muted-foreground">Withdraw your earnings to mobile money or bank account</p>
      </div>

      {/* Balance + Withdraw Card */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1 border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/10">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600">
                <WalletIcon className="size-4" />
              </span>
              Available Balance
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold tabular-nums text-emerald-700 dark:text-emerald-400">
              {formatCurrency(availableBalance)} TZS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger render={
                <Button className="w-full" disabled={availableBalance < 1000}>
                  <BanknoteIcon className="size-4" />
                  Withdraw Funds
                </Button>
              } />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Funds</DialogTitle>
                  <DialogDescription>
                    Enter the amount you want to withdraw. A 1.5% commission will be deducted.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (TZS)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="e.g. 50000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="1000"
                      max={availableBalance}
                    />
                    <p className="text-xs text-muted-foreground">
                      Available: {formatCurrency(availableBalance)} TZS · Min: 1,000 TZS
                    </p>
                  </div>

                  {amount && parseFloat(amount) > 0 && (
                    <div className="rounded-lg bg-muted p-3 space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Withdrawal Amount</span>
                        <span className="font-medium tabular-nums">{formatCurrency(parseFloat(amount))} TZS</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <PercentIcon className="size-3" /> Commission (1.5%)
                        </span>
                        <span className="font-medium tabular-nums text-red-500">
                          -{formatCurrency(parseFloat(amount) * 0.015)} TZS
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-1.5">
                        <span className="font-semibold">You Receive</span>
                        <span className="font-bold tabular-nums text-emerald-600">
                          {formatCurrency(parseFloat(amount) * 0.985)} TZS
                        </span>
                      </div>
                    </div>
                  )}

                  {payout && (
                    <div className="rounded-lg border p-3 text-xs">
                      <p className="font-semibold mb-1">Payout Destination</p>
                      {payout.payout_channel === "mobile" ? (
                        <p className="text-muted-foreground">
                          Mobile Money: {payout.payout_phone || "Not set"}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">
                          Bank: {payout.payout_bank || "Not set"} — {payout.payout_bank_account || "Not set"}
                        </p>
                      )}
                      <p className="text-muted-foreground">Recipient: {payout.payout_recipient_name || "Not set"}</p>
                      {!hasPayoutSettings && (
                        <Button variant="link" size="sm" className="p-0 h-auto mt-1" onClick={() => router.push("/dashboard/payout-settings")}>
                          Configure payout settings →
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleWithdraw} disabled={submitting}>
                    {submitting ? <Spinner className="size-4" /> : <BanknoteIcon className="size-4" />}
                    Confirm Withdrawal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {availableBalance < 1000 && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Minimum withdrawal amount is 1,000 TZS
              </p>
            )}
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Total Earned</p>
                <p className="text-lg font-bold tabular-nums">{formatCurrency(revenue?.total_earned || "0")} TZS</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Total Withdrawn</p>
                <p className="text-lg font-bold tabular-nums">{formatCurrency(revenue?.total_withdrawn || "0")} TZS</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Total Commission</p>
                <p className="text-lg font-bold tabular-nums text-red-500">{formatCurrency(revenue?.total_commission || "0")} TZS</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Pending</p>
                <p className="text-lg font-bold tabular-nums">{revenue?.pending_withdrawals || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Settings Warning */}
      {!hasPayoutSettings && (
        <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/10">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 shrink-0">
              <AlertCircleIcon className="size-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Payout settings not configured</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                You need to set up your payout details (mobile money or bank account) before you can withdraw funds.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/payout-settings")}>
              Configure Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Withdrawals History */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>All your withdrawal requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {withdrawals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <ArrowDownToLineIcon className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No withdrawals yet</p>
              <p className="text-xs text-muted-foreground">Your withdrawal history will appear here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {withdrawals.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                      w.status === "completed" ? "bg-emerald-500/15 text-emerald-600" :
                      w.status === "pending" ? "bg-amber-500/15 text-amber-600" :
                      "bg-red-500/15 text-red-600"
                    }`}>
                      {w.status === "completed" ? <CheckCircleIcon className="size-5" /> :
                       w.status === "pending" ? <ClockIcon className="size-5" /> :
                       <XCircleIcon className="size-5" />}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm tabular-nums">
                        {formatCurrency(w.amount)} TZS
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        {w.channel === "mobile" ? "Mobile Money" : "Bank Transfer"} · {w.recipient_name}
                        <span className="text-muted-foreground/50">·</span>
                        {formatDateTime(w.created_at)}
                      </p>
                      {w.failure_reason && (
                        <p className="text-xs text-red-500 mt-0.5">{w.failure_reason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={w.status === "completed" ? "default" : w.status === "pending" ? "secondary" : "outline"}>
                      {w.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      Net: {formatCurrency(w.net_amount)} TZS
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
    </svg>
  )
}
