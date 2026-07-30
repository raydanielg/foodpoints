"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts"

import { cn } from "@/lib/utils"

type ChartConfig = Record<
  string,
  {
    label: string
    color?: string
  }
>

const ChartContext = React.createContext<ChartConfig | null>(null)

function useChartConfig() {
  const ctx = React.useContext(ChartContext)
  if (!ctx) return {}
  return ctx
}

function ChartContainer({
  config,
  className,
  children,
}: {
  config: ChartConfig
  className?: string
  children: React.ReactElement
}) {
  return (
    <ChartContext.Provider value={config}>
      <div
        className={cn(
          "flex aspect-auto w-full justify-center text-xs",
          className
        )}
      >
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: any[]
  label?: string
  hideLabel?: boolean
  nameKey?: string
  className?: string
  labelFormatter?: (value: string) => string
  formatter?: (value: number, name: string) => string
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(
  (
    { active, payload, label, hideLabel, className, labelFormatter, formatter },
    ref
  ) => {
    if (!active || !payload?.length) return null
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-background px-3 py-2 text-sm shadow-md",
          className
        )}
      >
        {!hideLabel && label && (
          <p className="mb-1 font-medium text-foreground">
            {labelFormatter ? labelFormatter(label) : label}
          </p>
        )}
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium tabular-nums">
              {formatter ? formatter(entry.value, entry.name) : entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

function ChartTooltip({
  content,
  cursor,
}: {
  content: React.ReactElement
  cursor?: boolean | object
}) {
  return (
    <RechartsTooltip
      cursor={cursor}
      content={content}
    />
  )
}

export {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
}
