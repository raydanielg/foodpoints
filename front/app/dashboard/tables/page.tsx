"use client"

import * as React from "react"
import {
  PlusIcon,
  TrashIcon,
  RefreshCwIcon,
  CheckIcon,
  CopyIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { QrCode, QrCodeWithCopy, type QrState } from "@/components/ui/qr-code"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { api, type RestaurantTable } from "@/lib/api"

export default function TablesPage() {
  const [tables, setTables] = React.useState<RestaurantTable[]>([])
  const [loading, setLoading] = React.useState(true)
  const [open, setOpen] = React.useState(false)
  const [tableNumber, setTableNumber] = React.useState("")
  const [saving, setSaving] = React.useState(false)
  const [qrTable, setQrTable] = React.useState<RestaurantTable | null>(null)
  const [regeneratingId, setRegeneratingId] = React.useState<number | null>(null)
  const [qrStates, setQrStates] = React.useState<Record<number, QrState>>({})
  const [copiedId, setCopiedId] = React.useState<number | null>(null)

  const load = () => {
    api.getTables().then((res) => setTables(res.tables)).finally(() => setLoading(false))
  }

  React.useEffect(() => {
    load()
  }, [])

  const getQrUrl = (token: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/t/${token}`
    }
    return `/t/${token}`
  }

  const handleCreate = async () => {
    setSaving(true)
    try {
      await api.createTable({ table_number: tableNumber })
      setOpen(false)
      setTableNumber("")
      load()
    } catch {
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this table?")) return
    await api.deleteTable(id)
    load()
  }

  const handleRegenerate = async (id: number) => {
    setRegeneratingId(id)
    setQrStates((prev) => ({ ...prev, [id]: "loading" }))
    try {
      await api.regenerateQr(id)
      await load()
      setQrStates((prev) => ({ ...prev, [id]: "scanned" }))
      setTimeout(() => {
        setQrStates((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
      }, 2000)
    } catch {
      setQrStates((prev) => ({ ...prev, [id]: "expired" }))
    } finally {
      setRegeneratingId(null)
    }
  }

  const handleCopy = async (table: RestaurantTable) => {
    try {
      await navigator.clipboard.writeText(getQrUrl(table.qr_token))
      setCopiedId(table.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading tables&hellip;</p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tables & QR Codes</h2>
          <p className="text-muted-foreground">Manage your restaurant tables</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button size="sm">
                <PlusIcon className="size-4" />
                Add Table
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Table</DialogTitle>
              <DialogDescription>Add a new table with auto-generated QR code</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="table-number">Table Number</Label>
              <Input
                id="table-number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. T-01"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={saving || !tableNumber}>
                {saving ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {tables.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No tables yet. Add your first table.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tables.map((table) => {
            const qrUrl = getQrUrl(table.qr_token)
            const qrState = qrStates[table.id] || "default"
            return (
              <Card key={table.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Table {table.table_number}</CardTitle>
                      <CardDescription>
                        Token: {table.qr_token.substring(0, 12)}...
                      </CardDescription>
                    </div>
                    <Badge variant={table.status === "free" ? "default" : "secondary"}>
                      {table.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <QrCode
                      value={qrUrl}
                      state={qrState}
                      onRefresh={() => handleRegenerate(table.id)}
                      size={176}
                      className="mx-auto"
                    />
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full rounded-md border bg-muted px-3 py-2 pr-9 text-xs text-muted-foreground"
                        value={qrUrl}
                        disabled
                        readOnly
                      />
                      <button
                        onClick={() => handleCopy(table)}
                        className="absolute end-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted-foreground/10"
                        aria-label="Copy URL"
                      >
                        {copiedId === table.id ? (
                          <CheckIcon className="size-3.5 text-emerald-500" />
                        ) : (
                          <CopyIcon className="size-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setQrTable(table)}
                      >
                        View QR
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRegenerate(table.id)}
                        disabled={regeneratingId === table.id}
                      >
                        {regeneratingId === table.id ? (
                          <Spinner className="size-4" />
                        ) : (
                          <RefreshCwIcon className="size-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(table.id)}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* QR View Dialog */}
      <Dialog open={!!qrTable} onOpenChange={(v) => !v && setQrTable(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code - Table {qrTable?.table_number}</DialogTitle>
            <DialogDescription>
              Print and place this QR code on the table
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {qrTable && (
              <QrCodeWithCopy value={getQrUrl(qrTable.qr_token)} size={192} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
