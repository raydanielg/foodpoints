"use client"

import * as React from "react"
import { CheckIcon, ClockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api, type Payment } from "@/lib/api"

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
    await api.confirmCash(id)
    load()
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading payments&hellip;</p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:px-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
        <p className="text-muted-foreground">Track and confirm payments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Management</CardTitle>
          <CardDescription>
            Cash payments require waiter confirmation. Digital payments are auto-confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No payments to display. Payments will appear here as customers pay.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">
                        {parseFloat(p.amount).toLocaleString()} TZS
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.method} — {p.split_type}
                        {p.payer_label && ` — by ${p.payer_label}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.status === "pending" && p.method === "cash" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConfirmCash(p.id)}
                      >
                        <CheckIcon className="size-4" />
                        Confirm Cash
                      </Button>
                    ) : (
                      <Badge variant={p.status === "completed" ? "default" : "secondary"}>
                        {p.status === "pending" && <ClockIcon className="size-3" />}
                        {p.status}
                      </Badge>
                    )}
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
