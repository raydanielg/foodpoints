"use client"

import * as React from "react"
import {
  BellIcon,
  ClipboardListIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  MailIcon,
  MessageSquareIcon,
  SaveIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api, type User } from "@/lib/api"

type NotificationPref = {
  id: string
  label: string
  description: string
  icon: React.ElementType
  email: boolean
  push: boolean
}

export default function NotificationsPage() {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  const [prefs, setPrefs] = React.useState<NotificationPref[]>([
    {
      id: "new_orders",
      label: "New Orders",
      description: "Get notified when a new order is placed",
      icon: ClipboardListIcon,
      email: true,
      push: true,
    },
    {
      id: "order_ready",
      label: "Order Ready",
      description: "When kitchen marks an order as ready",
      icon: CheckCircleIcon,
      email: false,
      push: true,
    },
    {
      id: "payment_received",
      label: "Payment Received",
      description: "When a payment is completed by a customer",
      icon: CheckCircleIcon,
      email: true,
      push: true,
    },
    {
      id: "payment_failed",
      label: "Payment Failed",
      description: "When a payment fails or is incomplete",
      icon: AlertTriangleIcon,
      email: true,
      push: true,
    },
    {
      id: "daily_summary",
      label: "Daily Summary",
      description: "A daily report of your restaurant's performance",
      icon: MailIcon,
      email: true,
      push: false,
    },
    {
      id: "staff_activity",
      label: "Staff Activity",
      description: "When staff members join or leave",
      icon: MessageSquareIcon,
      email: false,
      push: false,
    },
  ])

  React.useEffect(() => {
    api
      .me()
      .then((res) => setUser(res.user))
      .finally(() => setLoading(false))
  }, [])

  const togglePref = (id: string, channel: "email" | "push") => {
    setPrefs((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [channel]: !p[channel] } : p
      )
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      // Simulate saving preferences (stored locally in a real app this would be an API call)
      localStorage.setItem("notification_prefs", JSON.stringify(prefs))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  React.useEffect(() => {
    const stored = localStorage.getItem("notification_prefs")
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as NotificationPref[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPrefs(parsed)
        }
      } catch {
        // ignore
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading notifications&hellip;</p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:px-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground">
          Choose how you want to be notified about activity
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellIcon className="size-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Manage email and push notifications for each event type
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {/* Header row */}
          <div className="flex items-center gap-4 border-b pb-2">
            <span className="flex-1 text-xs font-medium text-muted-foreground">
              Event
            </span>
            <span className="w-16 text-center text-xs font-medium text-muted-foreground">
              Email
            </span>
            <span className="w-16 text-center text-xs font-medium text-muted-foreground">
              Push
            </span>
          </div>

          {prefs.map((pref) => (
            <div
              key={pref.id}
              className="flex items-center gap-4 rounded-lg border p-3"
            >
              <div className="flex flex-1 items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <pref.icon className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{pref.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {pref.description}
                  </span>
                </div>
              </div>

              <button
                onClick={() => togglePref(pref.id, "email")}
                className={`flex h-6 w-12 items-center rounded-full p-0.5 transition-colors ${
                  pref.email ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`size-5 rounded-full bg-white shadow-sm transition-transform ${
                    pref.email ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>

              <button
                onClick={() => togglePref(pref.id, "push")}
                className={`flex h-6 w-12 items-center rounded-full p-0.5 transition-colors ${
                  pref.push ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`size-5 rounded-full bg-white shadow-sm transition-transform ${
                    pref.push ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}

          <div className="flex items-center gap-3 pt-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Spinner className="size-4" />
              ) : (
                <SaveIcon className="size-4" />
              )}
              Save Preferences
            </Button>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-emerald-600">
                <CheckCircleIcon className="size-4" />
                Preferences saved!
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent notifications */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Your latest activity alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <CheckCircleIcon className="size-4" />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium">Payment received</span>
                <span className="text-xs text-muted-foreground">
                  A payment of 15,000 TZS was completed
                </span>
              </div>
              <span className="text-xs text-muted-foreground">2m ago</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <ClipboardListIcon className="size-4" />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium">New order placed</span>
                <span className="text-xs text-muted-foreground">
                  Table 5 placed a new order
                </span>
              </div>
              <span className="text-xs text-muted-foreground">15m ago</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <AlertTriangleIcon className="size-4" />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium">Payment pending</span>
                <span className="text-xs text-muted-foreground">
                  A cash payment needs confirmation
                </span>
              </div>
              <span className="text-xs text-muted-foreground">1h ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
