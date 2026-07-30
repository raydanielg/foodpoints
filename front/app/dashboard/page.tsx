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
  EyeIcon,
  EyeOffIcon,
  SparklesIcon,
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
import { Button } from "@/components/ui/button"
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
import { api, type RestaurantStats, type Restaurant } from "@/lib/api"

function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "0"
  return num.toLocaleString()
}

function formatChartDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

interface KpiCardProps {
  title: string
  value: string
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
  accent: string
  hidden?: boolean
  onToggleHidden?: () => void
  showEyeToggle?: boolean
}

function KpiCard({ title, value, icon, trend, trendUp, accent, hidden, onToggleHidden, showEyeToggle }: KpiCardProps) {
  return (
    <Card className="relative overflow-hidden rounded-xl">
      <div
        className="absolute right-0 top-0 h-20 w-20 rounded-full opacity-[0.07] blur-2xl"
        style={{ backgroundColor: accent }}
      />
      <CardHeader className="pb-3">
        <CardDescription className="flex items-center gap-2">
          <span
            className="flex size-7 items-center justify-center rounded-md"
            style={{ backgroundColor: `${accent}18`, color: accent }}
          >
            {icon}
          </span>
          {title}
        </CardDescription>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xl font-bold tabular-nums sm:text-2xl">
            {hidden ? "••••••" : value}
          </CardTitle>
          {showEyeToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:bg-muted"
              onClick={onToggleHidden}
            >
              {hidden ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
              <span className="sr-only">{hidden ? "Show" : "Hide"} value</span>
            </Button>
          )}
        </div>
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
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [revenueHidden, setRevenueHidden] = React.useState(true)

  React.useEffect(() => {
    Promise.all([api.getStats(), api.getRestaurant()])
      .then(([statsRes, restRes]) => {
        setStats(statsRes.stats)
        setRestaurant(restRes.restaurant)
      })
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

  const hotelName = restaurant?.name || "FoodPoint"
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:gap-6 lg:px-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1 rounded-xl border bg-gradient-to-br from-muted/50 to-transparent p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl">👋</span>
          <div>
            <h2 className="text-lg font-bold tracking-tight sm:text-xl">
              {getGreeting()}, {hotelName}
            </h2>
            <p className="text-sm text-muted-foreground">{today}</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 sm:flex">
          <SparklesIcon className="size-4 text-primary" />
          <span className="text-xs font-medium text-primary">
            {stats.active_sessions > 0 ? `${stats.active_sessions} tables active now` : "No active tables"}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard
          title="Today's Revenue"
          value={`${formatCurrency(stats.today_revenue)} TZS`}
          icon={<WalletIcon className="size-4" />}
          trend="Today"
          trendUp
          accent="oklch(0.646 0.222 41.116)"
          hidden={revenueHidden}
          onToggleHidden={() => setRevenueHidden(!revenueHidden)}
          showEyeToggle
        />
        <KpiCard
          title="This Week"
          value={`${formatCurrency(stats.week_revenue)} TZS`}
          icon={<TrendingUpIcon className="size-4" />}
          trend="Week"
          trendUp
          accent="oklch(0.6 0.118 184.704)"
          hidden={revenueHidden}
          onToggleHidden={() => setRevenueHidden(!revenueHidden)}
          showEyeToggle
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
      <Card className="rounded-xl">
        <CardHeader>
          <CardDescription>Revenue Overview</CardDescription>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUpIcon className="size-5 text-primary" />
            Last 7 Days Revenue
          </CardTitle>
          <CardAction>
            <Badge variant="secondary">
              {revenueHidden ? "Total: ••••••" : `Total: ${formatCurrency(stats.week_revenue)} TZS`}
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
        <Card className="flex flex-col rounded-xl">
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
        <Card className="rounded-xl">
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
      <Card className="rounded-xl">
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
