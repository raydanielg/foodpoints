"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api, type Order } from "@/lib/api"

export default function OrdersPage() {
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

  const handleMarkServed = async (itemId: number) => {
    await api.markItemServed(itemId)
    load()
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading orders&hellip;</p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:px-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Active Orders</h2>
        <p className="text-muted-foreground">Manage and track all active orders</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No active orders right now.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Order #{order.id}</CardTitle>
                  <Badge variant="outline">{order.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Table {order.session?.table?.table_number} —{" "}
                  {new Date(order.created_at).toLocaleTimeString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-md border p-2 text-sm"
                    >
                      <div className="flex-1">
                        <span className="font-medium">{item.quantity}x</span>{" "}
                        {item.menu_item?.name}
                        {item.notes && (
                          <p className="text-xs text-muted-foreground">
                            Note: {item.notes}
                          </p>
                        )}
                      </div>
                      {item.served ? (
                        <Badge variant="outline">
                          <CheckIcon className="size-3" />
                          Served
                        </Badge>
                      ) : (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => handleMarkServed(item.id)}
                        >
                          Mark Served
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
