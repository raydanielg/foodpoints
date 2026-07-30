"use client"

import * as React from "react"
import {
  WalletIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  BanknoteIcon,
  ReceiptIcon,
  ClockIcon,
  ArrowUpRightIcon,
  PercentIcon,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { api, type RevenueData } from "@/lib/api"
import { useRouter } from "next/navigation"

function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "0"
  return num.toLocaleString()
}

function formatChartDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { weekday: "short" })
}

const revenueChartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

const methodColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"]

const methodChartConfig = {
  mobile_money: { label: "Mobile Money", color: "var(--chart-1)" },
  card: { label: "Card", color: "var(--chart-2)" },
  cash: { label: "Cash", color: "var(--chart-3)" },
} satisfies ChartConfig

export default function RevenuePage() {
  const router = useRouter()
  const [revenue, setRevenue] = React.useState<RevenueData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    api
      .getRevenue()
      .then((res) => setRevenue(res.revenue))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading revenue&hellip;</p>
      </div>
    )
  }

  if (!revenue) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <p className="mb-1 text-lg font-medium">Failed to load revenue data</p>
          <p className="text-sm text-muted-foreground">Make sure your backend is running.</p>
        </div>
      </div>
    )
  }

  const dailyData = (revenue.daily_revenue || []).map((d) => ({
    date: formatChartDate(d.date),
    revenue: parseFloat(d.total || "0"),
    count: d.count,
  }))

  const methodData = (revenue.method_stats || []).map((m, i) => ({
    name: m.method === "mobile_money" ? "Mobile Money" : m.method === "card" ? "Card" : "Cash",
    value: parseFloat(m.total || "0"),
    count: m.count,
    fill: methodColors[i % methodColors.length],
  }))

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:gap-6 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Revenue & Earnings</h2>
          <p className="text-muted-foreground">Track your revenue, commission, and withdraw your earnings</p>
        </div>
        <Button onClick={() => router.push("/dashboard/withdrawals")}>
          <BanknoteIcon className="size-4" />
          Withdraw
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
        {/* Available Balance - Hero Card */}
        <Card className="relative overflow-hidden lg:col-span-1 border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/10">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600">
                <WalletIcon className="size-4" />
              </span>
              Available Balance
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold tabular-nums text-emerald-700 dark:text-emerald-400">
              {formatCurrency(revenue.available_balance)} TZS
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="flex items-center gap-2 font-medium text-emerald-600">
              Ready to withdraw
              <ArrowUpRightIcon className="size-4" />
            </div>
            <p className="text-xs text-muted-foreground">
              Min withdrawal: 1,000 TZS · 1.5% commission per transaction
            </p>
          </CardFooter>
        </Card>

        {/* Total Earned & Commission */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Total Earned</p>
                <p className="text-lg font-bold tabular-nums">{formatCurrency(revenue.total_earned)} TZS</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Total Withdrawn</p>
                <p className="text-lg font-bold tabular-nums">{formatCurrency(revenue.total_withdrawn)} TZS</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <PercentIcon className="size-3" /> Platform Commission (1.5%)
                </p>
                <p className="text-lg font-bold tabular-nums text-red-500">{formatCurrency(revenue.total_commission)} TZS</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Pending Withdrawals</p>
                <p className="text-lg font-bold tabular-nums">{revenue.pending_withdrawals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-orange-500/15 text-orange-600">
                <ReceiptIcon className="size-4" />
              </span>
              Today&apos;s Revenue
            </CardDescription>
            <CardTitle className="text-xl font-bold tabular-nums">{formatCurrency(revenue.today_revenue)} TZS</CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-emerald-600">
                <TrendingUpIcon className="size-3" />
                {revenue.today_payments} payments
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600">
                <TrendingUpIcon className="size-4" />
              </span>
              This Week
            </CardDescription>
            <CardTitle className="text-xl font-bold tabular-nums">{formatCurrency(revenue.week_revenue)} TZS</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-purple-500/15 text-purple-600">
                <WalletIcon className="size-4" />
              </span>
              This Month
            </CardDescription>
            <CardTitle className="text-xl font-bold tabular-nums">{formatCurrency(revenue.month_revenue)} TZS</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-red-500/15 text-red-600">
                <PercentIcon className="size-4" />
              </span>
              Month Commission
            </CardDescription>
            <CardTitle className="text-xl font-bold tabular-nums text-red-500">{formatCurrency(revenue.month_commission)} TZS</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Revenue Chart + Method Distribution */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Revenue Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardDescription>Revenue Overview</CardDescription>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUpIcon className="size-5 text-primary" />
              Last 7 Days Revenue
            </CardTitle>
            <CardAction>
              <Badge variant="secondary">
                Total: {formatCurrency(revenue.week_revenue)} TZS
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-2">
            {dailyData.length === 0 ? (
              <div className="flex h-[250px] items-center justify-center">
                <p className="text-sm text-muted-foreground">No revenue data for the last 7 days yet.</p>
              </div>
            ) : (
              <ChartContainer config={revenueChartConfig} className="aspect-auto h-[250px] w-full">
                <AreaChart data={dailyData} margin={{ left: 0, right: 10, top: 5 }}>
                  <defs>
                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} stroke="var(--muted-foreground)" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip cursor={{ stroke: "var(--primary)", strokeWidth: 1 }} content={<ChartTooltipContent formatter={(value) => `${formatCurrency(value)} TZS`} />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="var(--color-revenue)" strokeWidth={2} fill="url(#fillRevenue)" />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods Pie */}
        <Card>
          <CardHeader className="items-center pb-0">
            <CardDescription>Payment Methods</CardDescription>
            <CardTitle className="text-lg">Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            {methodData.length === 0 ? (
              <div className="flex h-[250px] items-center justify-center">
                <p className="text-sm text-muted-foreground">No data yet.</p>
              </div>
            ) : (
              <ChartContainer config={methodChartConfig} className="mx-auto aspect-square max-h-[250px] pb-0">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel formatter={(value) => `${formatCurrency(value)} TZS`} />} />
                  <Pie data={methodData} dataKey="value" nameKey="name" label innerRadius={50} />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            {methodData.map((m) => (
              <div key={m.name} className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: m.fill }} />
                  <span className="text-xs font-medium">{m.name}</span>
                </div>
                <span className="text-xs font-bold tabular-nums">{formatCurrency(m.value)} TZS</span>
              </div>
            ))}
          </CardFooter>
        </Card>
      </div>

      {/* Commission Info Banner */}
      <Card className="border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/10">
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 shrink-0">
            <PercentIcon className="size-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">How Commission Works</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              FoodPoint charges a <strong>1.5% commission</strong> on every completed payment transaction.
              This commission is automatically deducted before the amount is added to your available balance.
              For example, on a 10,000 TZS payment, you receive 9,850 TZS and the platform takes 150 TZS.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
