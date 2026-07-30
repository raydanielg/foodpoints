"use client"

import * as React from "react"
import {
  TrendingUpIcon,
  TrendingDownIcon,
  ClipboardListIcon,
  UsersIcon,
  UtensilsCrossedIcon,
  ReceiptIcon,
  WalletIcon,
  ClockIcon,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
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
import { Spinner } from "@/components/ui/spinner"
import { api, type RestaurantStats } from "@/lib/api"

function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "0"
  return num.toLocaleString()
}

function formatChartDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

interface KpiCardProps {
  title: string
  value: string
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
  accent: string
}

function KpiCard({ title, value, icon, trend, trendUp, accent }: KpiCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div
        className="absolute right-0 top-0 h-24 w-24 rounded-full opacity-10 blur-2xl"
        style={{ backgroundColor: accent }}
      />
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <span
            className="flex size-7 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${accent}20`, color: accent }}
          >
            {icon}
          </span>
          {title}
        </CardDescription>
        <CardTitle className="text-xl font-bold tabular-nums sm:text-2xl">
          {value}
        </CardTitle>
        {trend && (
          <CardAction>
            <Badge
              variant="outline"
              className={trendUp ? "text-emerald-600" : "text-red-500"}
            >
              {trendUp ? (
                <TrendingUpIcon className="size-3" />
              ) : (
                <TrendingDownIcon className="size-3" />
              )}
              {trend}
            </Badge>
          </CardAction>
        )}
      </CardHeader>
    </Card>
  )
}

const revenueChartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  payments: { label: "Payments", color: "var(--chart-2)" },
} satisfies ChartConfig

const pieChartConfig = {
  item0: { label: "Top Item", color: "var(--chart-1)" },
  item1: { label: "Item 2", color: "var(--chart-2)" },
  item2: { label: "Item 3", color: "var(--chart-3)" },
  item3: { label: "Item 4", color: "var(--chart-4)" },
  item4: { label: "Item 5", color: "var(--chart-5)" },
} satisfies ChartConfig

const radarChartConfig = {
  orders: { label: "Orders", color: "var(--chart-1)" },
} satisfies ChartConfig

export default function DashboardPage() {
  const [stats, setStats] = React.useState<RestaurantStats | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    api
      .getStats()
      .then((res) => setStats(res.stats))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading dashboard&hellip;</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <p className="mb-1 text-lg font-medium">Failed to load stats</p>
          <p className="text-sm text-muted-foreground">
            Make sure your backend is running and you have data.
          </p>
        </div>
      </div>
    )
  }

  const revenueData = (stats.daily_revenue || []).map((d) => ({
    date: formatChartDate(d.date),
    revenue: parseFloat(d.revenue || "0"),
    payments: d.payments_count,
  }))

  const pieData = (stats.top_sellers || []).slice(0, 5).map((item, i) => ({
    name: item.name,
    sold: item.total_sold,
    fill: `var(--color-item${i})`,
  }))

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    preparing: "Preparing",
    ready: "Ready",
    served: "Served",
    completed: "Completed",
    cancelled: "Cancelled",
  }

  const radarData = Object.entries(stats.orders_by_status || {}).map(
    ([status, count]) => ({
      status: statusLabels[status] || status,
      orders: count,
    })
  )

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:gap-6 lg:px-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard
          title="Today's Revenue"
          value={`${formatCurrency(stats.today_revenue)} TZS`}
          icon={<WalletIcon className="size-4" />}
          trend="Today"
          trendUp
          accent="oklch(0.646 0.222 41.116)"
        />
        <KpiCard
          title="This Week"
          value={`${formatCurrency(stats.week_revenue)} TZS`}
          icon={<TrendingUpIcon className="size-4" />}
          trend="Week"
          trendUp
          accent="oklch(0.6 0.118 184.704)"
        />
        <KpiCard
          title="Active Tables"
          value={String(stats.active_sessions)}
          icon={<UsersIcon className="size-4" />}
          trend="Open"
          trendUp
          accent="oklch(0.828 0.189 84.429)"
        />
        <KpiCard
          title="Orders Today"
          value={String(stats.total_orders_today)}
          icon={<ClipboardListIcon className="size-4" />}
          trend="Today"
          trendUp
          accent="oklch(0.769 0.188 70.08)"
        />
      </div>

      {/* Revenue Area Chart */}
      <Card>
        <CardHeader>
          <CardDescription>Revenue Overview</CardDescription>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUpIcon className="size-5 text-primary" />
            Last 7 Days Revenue
          </CardTitle>
          <CardAction>
            <Badge variant="secondary">
              Total: {formatCurrency(stats.week_revenue)} TZS
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="pt-2">
          {revenueData.length === 0 ? (
            <div className="flex h-[250px] items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No revenue data for the last 7 days yet.
              </p>
            </div>
          ) : (
            <ChartContainer
              config={revenueChartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={revenueData} margin={{ left: 0, right: 10, top: 5 }}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={20}
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <ChartTooltip
                  cursor={{ stroke: "var(--primary)", strokeWidth: 1 }}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => `${formatCurrency(value)} TZS`}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  fill="url(#fillRevenue)"
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Pie Chart + Radar Chart */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Top Sellers Pie Chart */}
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardDescription>Top Sellers (This Month)</CardDescription>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UtensilsCrossedIcon className="size-5 text-primary" />
              Sales Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            {pieData.length === 0 ? (
              <div className="flex h-[250px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No sales data yet.
                </p>
              </div>
            ) : (
              <ChartContainer
                config={pieChartConfig}
                className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={pieData}
                    dataKey="sold"
                    label
                    nameKey="name"
                  />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              {stats.top_sellers[0]?.name || "No data"} leads this month
              <TrendingUpIcon className="size-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Based on units sold this month
            </div>
          </CardFooter>
        </Card>

        {/* Orders by Status Radar Chart */}
        <Card>
          <CardHeader className="items-center">
            <CardDescription>Orders by Status (This Week)</CardDescription>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardListIcon className="size-5 text-primary" />
              Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-0">
            {radarData.length === 0 ? (
              <div className="flex h-[250px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No orders this week yet.
                </p>
              </div>
            ) : (
              <ChartContainer
                config={radarChartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <RadarChart data={radarData}>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <PolarAngleAxis dataKey="status" />
                  <PolarGrid />
                  <Radar
                    dataKey="orders"
                    fill="var(--color-orders)"
                    fillOpacity={0.6}
                    dot={{
                      r: 4,
                      fillOpacity: 1,
                    }}
                  />
                </RadarChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              {stats.total_orders_today} orders today
              <TrendingUpIcon className="size-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Weekly order status breakdown
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardDescription>Recent Orders</CardDescription>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ReceiptIcon className="size-5 text-primary" />
            Latest Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {stats.recent_orders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No orders yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {stats.recent_orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ClipboardListIcon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        Table {order.table_number}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ClockIcon className="size-3" />
                        {new Date(order.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      order.status === "served" ||
                      order.status === "completed"
                        ? "default"
                        : order.status === "preparing"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {order.status}
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
