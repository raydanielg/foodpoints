"use client"

import * as React from "react"
import { ChefHatIcon, CheckIcon, ClockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api, type Order } from "@/lib/api"

const statusFlow: Record<string, string> = {
  received: "preparing",
  preparing: "ready",
  ready: "served",
}

const statusColor: Record<string, "default" | "secondary" | "outline"> = {
  received: "secondary",
  preparing: "default",
  ready: "default",
  served: "outline",
}

export default function KitchenPage() {
  const [orders, setOrders] = React.useState<Order[]>([])
  const [loading, setLoading] = React.useState(true)

  const load = () => {
    api.getKitchenOrders().then((res) => setOrders(res.orders)).finally(() => setLoading(false))
  }

  React.useEffect(() => {
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleAdvance = async (id: number, currentStatus: string) => {
    const next = statusFlow[currentStatus]
    if (!next) return
    await api.updateOrderStatus(id, next as Order["status"])
    load()
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading kitchen&hellip;</p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:px-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Kitchen Display</h2>
        <p className="text-muted-foreground">Real-time order board — auto-refreshes every 5s</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <ChefHatIcon className="mx-auto mb-4 size-12 text-muted-foreground" />
            <p className="text-muted-foreground">No active orders. Kitchen is all caught up!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {orders.map((order) => (
            <Card key={order.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Order #{order.id}
                  </CardTitle>
                  <Badge variant={statusColor[order.status]}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Table {order.session?.table?.table_number} —{" "}
                  {new Date(order.created_at).toLocaleTimeString()}
                </p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-1.5">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-md border p-2 text-sm"
                    >
                      <div>
                        <span className="font-medium">{item.quantity}x</span>{" "}
                        {item.menu_item?.name}
                        {item.notes && (
                          <p className="text-xs text-muted-foreground">
                            Note: {item.notes}
                          </p>
                        )}
                      </div>
                      {item.served && (
                        <CheckIcon className="size-4 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-3">
                  <Button
                    size="sm"
                    className="w-full"
                    variant={order.status === "ready" ? "default" : "outline"}
                    onClick={() => handleAdvance(order.id, order.status)}
                  >
                    {order.status === "received" && (
                      <>
                        <ClockIcon className="size-4" />
                        Start Preparing
                      </>
                    )}
                    {order.status === "preparing" && (
                      <>
                        <CheckIcon className="size-4" />
                        Mark as Ready
                      </>
                    )}
                    {order.status === "ready" && (
                      <>
                        <CheckIcon className="size-4" />
                        Mark as Served
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
