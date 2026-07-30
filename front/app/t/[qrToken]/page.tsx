"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import {
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  CheckIcon,
  ReceiptIcon,
  UtensilsCrossedIcon,
  ClockIcon,
  WalletIcon,
  CreditCardIcon,
  BanknoteIcon,
  SmartphoneIcon,
  PrinterIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  StoreIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  HomeIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { api, imageUrl, type MenuCategory, type TableSession, type RestaurantTable, type OrderItem, type Payment, type Restaurant, type Order } from "@/lib/api"

interface CartItem {
  menu_item_id: number
  name: string
  price: string
  quantity: number
  notes: string
  prep_time_min: number
}

function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "0"
  return num.toLocaleString()
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

const methodIcons = {
  mobile_money: SmartphoneIcon,
  card: CreditCardIcon,
  cash: BanknoteIcon,
}

const methodLabels = {
  mobile_money: "Mobile Money",
  card: "Card",
  cash: "Cash",
}

const splitLabels = {
  full: "Pay Full Bill",
  by_item: "Split by Item",
  equal: "Split Equally",
  by_amount: "Custom Amount",
}

const orderStatusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  received: { label: "Received", color: "bg-blue-500", icon: ClipboardListIcon },
  preparing: { label: "Preparing", color: "bg-amber-500", icon: ClockIcon },
  ready: { label: "Ready", color: "bg-purple-500", icon: UtensilsCrossedIcon },
  served: { label: "Served", color: "bg-emerald-500", icon: CheckCircleIcon },
}

type PaymentState = "idle" | "processing" | "success" | "failed"

export default function CustomerPage() {
  const params = useParams()
  const qrToken = params.qrToken as string

  const [table, setTable] = React.useState<RestaurantTable | null>(null)
  const [session, setSession] = React.useState<TableSession | null>(null)
  const [menu, setMenu] = React.useState<MenuCategory[]>([])
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [cart, setCart] = React.useState<CartItem[]>([])
  const [placing, setPlacing] = React.useState(false)
  const [payments, setPayments] = React.useState<Payment[]>([])
  const [activeTab, setActiveTab] = React.useState("menu")
  const [lastPayment, setLastPayment] = React.useState<Payment | null>(null)
  const [orderPlaced, setOrderPlaced] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(null)
  const [showReview, setShowReview] = React.useState(false)

  const load = () => {
    api.scanQr(qrToken).then((res) => {
      setTable(res.table)
      setSession(res.session)
      setMenu(res.menu)
      setRestaurant(res.restaurant || null)
      setLoading(false)
    }).catch((err) => {
      console.error("QR scan error:", err)
      setLoading(false)
    })
  }

  React.useEffect(() => {
    load()
  }, [qrToken])

  const refreshSession = () => {
    if (session) {
      api.getSessionOrders(session.id).then((res) => setSession(res.session))
      api.getSessionPayments(session.id).then((res) => setPayments(res.payments))
    }
  }

  React.useEffect(() => {
    if (session) {
      api.getSessionPayments(session.id).then((res) => setPayments(res.payments))
    }
  }, [session?.id])

  const addToCart = (item: { id: number; name: string; price: string; prep_time_min: number }) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menu_item_id === item.id)
      if (existing) {
        return prev.map((c) =>
          c.menu_item_id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      }
      return [
        ...prev,
        {
          menu_item_id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          notes: "",
          prep_time_min: item.prep_time_min,
        },
      ]
    })
  }

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.menu_item_id === id
            ? { ...c, quantity: Math.max(0, c.quantity + delta) }
            : c
        )
        .filter((c) => c.quantity > 0)
    )
  }

  const cartTotal = cart.reduce(
    (sum, c) => sum + parseFloat(c.price) * c.quantity,
    0
  )
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0)

  const handlePlaceOrder = async () => {
    if (!session || cart.length === 0) return
    setPlacing(true)
    try {
      await api.placeOrder({
        session_id: session.id,
        items: cart.map((c) => ({
          menu_item_id: c.menu_item_id,
          quantity: c.quantity,
          notes: c.notes || undefined,
        })),
      })
      setCart([])
      setShowReview(false)
      setOrderPlaced(true)
      setTimeout(() => setOrderPlaced(false), 4000)
      refreshSession()
      setActiveTab("orders")
    } catch {
    } finally {
      setPlacing(false)
    }
  }

  const allItems: OrderItem[] = React.useMemo(() => {
    if (!session?.orders) return []
    return session.orders.flatMap((o) => o.items || [])
  }, [session])

  const servedItems = allItems.filter((i) => i.served)
  const unpaidItems = allItems.filter((i) => i.served && !i.paid)
  const pendingItems = allItems.filter((i) => !i.served)
  const totalAmount = parseFloat(session?.total_amount || "0")
  const paidAmount = parseFloat(session?.paid_amount || "0")
  const remaining = totalAmount - paidAmount

  // Group orders by status for display
  const ordersByStatus = React.useMemo(() => {
    if (!session?.orders) return {} as Record<string, Order[]>
    return session.orders.reduce((acc, order) => {
      if (!acc[order.status]) acc[order.status] = []
      acc[order.status].push(order)
      return acc
    }, {} as Record<string, Order[]>)
  }, [session])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading&hellip;</p>
      </div>
    )
  }

  if (!table || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <p className="text-lg font-semibold">Invalid QR Code</p>
            <p className="text-sm text-muted-foreground">
              This QR code is not valid. Please ask your waiter for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {restaurant?.logo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={imageUrl(restaurant.logo_url) ?? ""}
                alt={restaurant?.name || "Restaurant"}
                className="size-10 rounded-xl object-cover"
              />
            ) : (
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <StoreIcon className="size-5" />
              </div>
            )}
            <div>
              <p className="font-bold leading-tight">{restaurant?.name || "Restaurant"}</p>
              <p className="text-xs text-muted-foreground">
                Table {table.table_number} · Session #{session.id}
              </p>
            </div>
          </div>
          <Badge variant={session.status === "open" ? "default" : "secondary"}>
            {session.status === "open" ? "Active" : "Closed"}
          </Badge>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Order placed toast */}
        {orderPlaced && (
          <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 animate-in fade-in-0 zoom-in-95">
            <Card className="border-emerald-500/30 bg-emerald-500/10 backdrop-blur">
              <CardContent className="flex items-center gap-2 py-3">
                <CheckCircleIcon className="size-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  Order placed! Kitchen has received your order.
                </span>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Receipt modal */}
        {lastPayment && (
          <ReceiptModal
            payment={lastPayment}
            restaurant={restaurant}
            table={table}
            session={session}
            onClose={() => setLastPayment(null)}
          />
        )}

        {/* Order Review Modal */}
        {showReview && (
          <OrderReviewModal
            cart={cart}
            cartTotal={cartTotal}
            placing={placing}
            onConfirm={handlePlaceOrder}
            onCancel={() => setShowReview(false)}
            onUpdateQty={updateQty}
            restaurant={restaurant}
          />
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="menu">
              <UtensilsCrossedIcon className="size-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ClipboardListIcon className="size-4" />
              Orders
              {allItems.length > 0 && (
                <span className="ml-1 rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
                  {allItems.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="bill">
              <ReceiptIcon className="size-4" />
              Bill
            </TabsTrigger>
          </TabsList>

          {/* ===== Menu Tab ===== */}
          <TabsContent value="menu" className="mt-4">
            {/* Cart bar (sticky bottom when items in cart) */}
            {cartCount > 0 && (
              <div className="sticky bottom-4 z-10 mb-4">
                <Card className="border-primary/30 shadow-lg">
                  <CardContent className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <ShoppingCartIcon className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{cartCount} item{cartCount > 1 ? "s" : ""}</p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          {formatCurrency(cartTotal)} TZS
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => setShowReview(true)}>
                      Review Order
                      <ArrowRightIcon className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {menu.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No menu items available yet.
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Category selector */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors",
                      selectedCategory === null
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <HomeIcon className="mr-1 inline size-4" />
                    All
                  </button>
                  {menu.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors",
                        selectedCategory === cat.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {cat.name}
                      {cat.items && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({cat.items.length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Menu items */}
                {selectedCategory === null ? (
                  // Show all categories
                  menu.map((cat) => (
                    <div key={cat.id}>
                      <div className="mb-3 flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{cat.name}</h3>
                        <Separator className="flex-1" />
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {cat.items?.map((item) => (
                          <MenuItemCard key={item.id} item={item} onAdd={addToCart} cart={cart} />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  // Show selected category only
                  <div>
                    {menu
                      .filter((c) => c.id === selectedCategory)
                      .map((cat) => (
                        <div key={cat.id}>
                          <div className="mb-3 flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{cat.name}</h3>
                            <Separator className="flex-1" />
                          </div>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {cat.items?.map((item) => (
                              <MenuItemCard key={item.id} item={item} onAdd={addToCart} cart={cart} />
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* ===== Orders Tab ===== */}
          <TabsContent value="orders" className="mt-4">
            <div className="flex flex-col gap-4">
              {allItems.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center gap-3 py-12">
                    <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                      <ClipboardListIcon className="size-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">No orders yet</p>
                      <p className="text-sm text-muted-foreground">
                        Browse the menu and place your first order
                      </p>
                    </div>
                    <Button onClick={() => setActiveTab("menu")}>
                      <UtensilsCrossedIcon className="size-4" />
                      Browse Menu
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Orders grouped by status */}
                  {Object.entries(ordersByStatus).map(([status, orders]) => {
                    const config = orderStatusConfig[status] || orderStatusConfig.received
                    const StatusIcon = config.icon
                    return (
                      <Card key={status}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <div className={cn("flex size-6 items-center justify-center rounded-md", config.color)}>
                              <StatusIcon className="size-3.5 text-white" />
                            </div>
                            {config.label}
                            <Badge variant="secondary" className="ml-1">
                              {orders.length}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col gap-2">
                            {orders.map((order) =>
                              order.items?.map((item) => (
                                <Item key={item.id} variant="muted">
                                  <ItemMedia>
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-background">
                                      <UtensilsCrossedIcon className="size-4 text-muted-foreground" />
                                    </div>
                                  </ItemMedia>
                                  <ItemContent>
                                    <ItemTitle className="line-clamp-1">
                                      {item.quantity}x {item.menu_item?.name}
                                    </ItemTitle>
                                    {item.notes && (
                                      <span className="text-xs text-muted-foreground">
                                        Note: {item.notes}
                                      </span>
                                    )}
                                    {item.paid && (
                                      <Badge variant="outline" className="mt-0.5 w-fit text-emerald-600">
                                        <CheckIcon className="size-3" />
                                        Paid{item.paid_by_label ? ` by ${item.paid_by_label}` : ""}
                                      </Badge>
                                    )}
                                  </ItemContent>
                                  <ItemContent className="flex-none justify-end">
                                    <span className="text-sm font-medium tabular-nums">
                                      {formatCurrency(parseFloat(item.unit_price) * item.quantity)} TZS
                                    </span>
                                  </ItemContent>
                                </Item>
                              ))
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}

                  {/* Quick action to bill */}
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setActiveTab("bill")}
                  >
                    <ReceiptIcon className="size-4" />
                    View Bill & Pay
                    <ChevronRightIcon className="size-4" />
                  </Button>
                </>
              )}
            </div>
          </TabsContent>

          {/* ===== Bill Tab ===== */}
          <TabsContent value="bill" className="mt-4">
            <div className="flex flex-col gap-4">
              {/* Bill Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ReceiptIcon className="size-4" />
                    Bill Summary
                  </CardTitle>
                  <CardDescription>
                    Table {table.table_number} · Session #{session.id}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Bill</span>
                      <span className="font-semibold tabular-nums">
                        {formatCurrency(totalAmount)} TZS
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Paid</span>
                      <span className="font-semibold text-emerald-600 tabular-nums">
                        {formatCurrency(paidAmount)} TZS
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-bold">Remaining</span>
                      <span className="font-bold text-lg tabular-nums">
                        {formatCurrency(remaining)} TZS
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* All ordered items */}
              {servedItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <UtensilsCrossedIcon className="size-4" />
                      Items Served
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      {servedItems.map((item) => (
                        <Item key={item.id} variant="muted">
                          <ItemContent>
                            <ItemTitle className="line-clamp-1">
                              {item.quantity}x {item.menu_item?.name}
                            </ItemTitle>
                            {item.paid ? (
                              <Badge variant="outline" className="mt-0.5 w-fit text-emerald-600">
                                <CheckIcon className="size-3" />
                                Paid{item.paid_by_label ? ` by ${item.paid_by_label}` : ""}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">Unpaid</span>
                            )}
                          </ItemContent>
                          <ItemContent className="flex-none justify-end">
                            <span className="text-sm font-medium tabular-nums">
                              {formatCurrency(parseFloat(item.unit_price) * item.quantity)} TZS
                            </span>
                          </ItemContent>
                        </Item>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Form / Checkout */}
              {remaining > 0 && session.status === "open" && (
                <CheckoutForm
                  sessionId={session.id}
                  remaining={remaining}
                  unpaidItems={unpaidItems}
                  onPaid={(payment) => {
                    setLastPayment(payment)
                    refreshSession()
                  }}
                  restaurant={restaurant}
                />
              )}

              {/* Payment History */}
              {payments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <WalletIcon className="size-4" />
                      Payment History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      {payments.map((p) => {
                        const MethodIcon = methodIcons[p.method]
                        return (
                          <Item key={p.id} variant="muted">
                            <ItemMedia>
                              <div className="flex size-9 items-center justify-center rounded-lg bg-background">
                                <MethodIcon className="size-4 text-muted-foreground" />
                              </div>
                            </ItemMedia>
                            <ItemContent>
                              <ItemTitle className="line-clamp-1 tabular-nums">
                                {formatCurrency(p.amount)} TZS
                              </ItemTitle>
                              <span className="text-xs text-muted-foreground">
                                {methodLabels[p.method]} · {splitLabels[p.split_type]}
                                {p.payer_label ? ` · by ${p.payer_label}` : ""}
                                {" · "}{formatTime(p.created_at)}
                              </span>
                            </ItemContent>
                            <ItemContent className="flex-none justify-end">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={p.status === "completed" ? "default" : "secondary"}
                                >
                                  {p.status}
                                </Badge>
                                {p.status === "completed" && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="size-8 p-0"
                                    onClick={() => setLastPayment(p)}
                                  >
                                    <ReceiptIcon className="size-4" />
                                  </Button>
                                )}
                              </div>
                            </ItemContent>
                          </Item>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Fully Paid */}
              {remaining <= 0 && totalAmount > 0 && (
                <Card className="border-emerald-500/30">
                  <CardContent className="py-8 text-center">
                    <CheckCircleIcon className="mx-auto mb-2 size-12 text-emerald-600" />
                    <p className="font-semibold text-lg">Bill Fully Paid!</p>
                    <p className="text-sm text-muted-foreground">
                      Thank you for dining with us. Come again!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ===== Menu Item Card =====
function MenuItemCard({
  item,
  onAdd,
  cart,
}: {
  item: {
    id: number
    name: string
    description: string | null
    price: string
    image_url: string | null
    prep_time_min: number
  }
  onAdd: (item: { id: number; name: string; price: string; prep_time_min: number }) => void
  cart: CartItem[]
}) {
  const inCart = cart.find((c) => c.menu_item_id === item.id)

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      {item.image_url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={imageUrl(item.image_url) ?? ""}
          alt={item.name}
          className="aspect-[4/3] w-full object-cover"
        />
      ) : null}
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex flex-1 gap-3">
          {item.image_url ? null : (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <UtensilsCrossedIcon className="size-5" />
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium">{item.name}</p>
            {item.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}
            <div className="mt-1 flex items-center gap-2">
              <p className="font-semibold text-primary">
                {formatCurrency(item.price)} TZS
              </p>
              {item.prep_time_min > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                  <ClockIcon className="size-3" />
                  {item.prep_time_min}m
                </span>
              )}
            </div>
          </div>
        </div>
        {inCart ? (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="size-8 p-0"
              onClick={() => onAdd(item)}
            >
              <PlusIcon className="size-4" />
            </Button>
            <span className="w-6 text-center font-bold tabular-nums">
              {inCart.quantity}
            </span>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAdd(item)}
          >
            <PlusIcon className="size-4" />
            Add
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// ===== Order Review Modal =====
function OrderReviewModal({
  cart,
  cartTotal,
  placing,
  onConfirm,
  onCancel,
  onUpdateQty,
  restaurant,
}: {
  cart: CartItem[]
  cartTotal: number
  placing: boolean
  onConfirm: () => void
  onCancel: () => void
  onUpdateQty: (id: number, delta: number) => void
  restaurant: Restaurant | null
}) {
  const vatPercent = parseFloat(restaurant?.vat_percent || "0")
  const vatAmount = vatPercent > 0 ? cartTotal * (vatPercent / 100) : 0
  const grandTotal = cartTotal + vatAmount

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCancel}>
      <Card className="max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardListIcon className="size-5" />
            Review Your Order
          </CardTitle>
          <CardDescription>
            Confirm before sending to kitchen
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {cart.map((c) => (
            <Item key={c.menu_item_id} variant="muted">
              <ItemMedia>
                <div className="flex size-9 items-center justify-center rounded-lg bg-background">
                  <UtensilsCrossedIcon className="size-4 text-muted-foreground" />
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="line-clamp-1">{c.name}</ItemTitle>
                {c.notes && (
                  <span className="text-xs text-muted-foreground">Note: {c.notes}</span>
                )}
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatCurrency(c.price)} TZS each
                </span>
              </ItemContent>
              <ItemContent className="flex-none justify-end">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="size-7 p-0"
                    onClick={() => onUpdateQty(c.menu_item_id, -1)}
                  >
                    <MinusIcon className="size-3.5" />
                  </Button>
                  <span className="w-6 text-center font-bold tabular-nums">
                    {c.quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="size-7 p-0"
                    onClick={() => onUpdateQty(c.menu_item_id, 1)}
                  >
                    <PlusIcon className="size-3.5" />
                  </Button>
                </div>
              </ItemContent>
            </Item>
          ))}

          <Separator />

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums">{formatCurrency(cartTotal)} TZS</span>
            </div>
            {vatPercent > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">VAT ({vatPercent}%)</span>
                <span className="tabular-nums">{formatCurrency(vatAmount)} TZS</span>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="tabular-nums">{formatCurrency(grandTotal)} TZS</span>
            </div>
          </div>

          <div className="rounded-lg bg-blue-500/10 p-3 text-center">
            <p className="text-xs text-blue-700">
              After placing, your order will be sent to the kitchen for review.
              You can track its status in the Orders tab.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
          <Button className="flex-1" onClick={onConfirm} disabled={placing || cart.length === 0}>
            {placing ? (
              <Spinner className="size-4" />
            ) : (
              <CheckIcon className="size-4" />
            )}
            Place Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// ===== Checkout Form =====
function CheckoutForm({
  sessionId,
  remaining,
  unpaidItems,
  onPaid,
  restaurant,
}: {
  sessionId: number
  remaining: number
  unpaidItems: OrderItem[]
  onPaid: (payment: Payment) => void
  restaurant: Restaurant | null
}) {
  const [splitType, setSplitType] = React.useState<"full" | "by_item" | "equal" | "by_amount">("full")
  const [method, setMethod] = React.useState<"mobile_money" | "card" | "cash">("mobile_money")
  const [payerLabel, setPayerLabel] = React.useState("")
  const [selectedItems, setSelectedItems] = React.useState<number[]>([])
  const [customAmount, setCustomAmount] = React.useState("")
  const [paymentState, setPaymentState] = React.useState<PaymentState>("idle")
  const [paymentError, setPaymentError] = React.useState("")

  const amountToPay = React.useMemo(() => {
    if (splitType === "full") return remaining
    if (splitType === "by_item") {
      return unpaidItems
        .filter((i) => selectedItems.includes(i.id))
        .reduce((sum, i) => sum + parseFloat(i.unit_price) * i.quantity, 0)
    }
    if (splitType === "by_amount") return parseFloat(customAmount) || 0
    return remaining
  }, [splitType, remaining, unpaidItems, selectedItems, customAmount])

  const handlePay = async () => {
    if (amountToPay <= 0) return
    setPaymentState("processing")
    setPaymentError("")
    try {
      const res = await api.makePayment({
        session_id: sessionId,
        amount: amountToPay,
        method,
        split_type: splitType,
        payer_label: payerLabel || undefined,
        item_ids: splitType === "by_item" ? selectedItems : undefined,
      })
      setPaymentState("success")
      setTimeout(() => {
        setPayerLabel("")
        setSelectedItems([])
        setCustomAmount("")
        setPaymentState("idle")
        onPaid(res.payment)
      }, 2000)
    } catch (err: unknown) {
      setPaymentState("failed")
      const message = err instanceof Error ? err.message : "Payment failed. Please try again."
      setPaymentError(message)
      setTimeout(() => {
        setPaymentState("idle")
        setPaymentError("")
      }, 4000)
    }
  }

  // Processing state
  if (paymentState === "processing") {
    return (
      <Card>
        <CardContent className="py-8">
          <Empty className="w-full max-w-xs mx-auto">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Spinner className="size-5" />
              </EmptyMedia>
              <EmptyTitle>Processing your payment</EmptyTitle>
              <EmptyDescription>
                Please wait while we process your {methodLabels[method]} payment of{" "}
                {formatCurrency(amountToPay)} TZS. Do not refresh the page.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm" disabled>
                Cancel
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  // Success state
  if (paymentState === "success") {
    return (
      <Card className="border-emerald-500/30">
        <CardContent className="py-8 text-center">
          <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-emerald-100 animate-in zoom-in-95">
            <CheckCircleIcon className="size-8 text-emerald-600" />
          </div>
          <p className="font-semibold text-lg text-emerald-700">Payment Successful!</p>
          <p className="text-sm text-muted-foreground tabular-nums">
            {formatCurrency(amountToPay)} TZS paid via {methodLabels[method]}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Failed state
  if (paymentState === "failed") {
    return (
      <Card className="border-red-500/30">
        <CardContent className="py-8 text-center">
          <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-red-100 animate-in zoom-in-95">
            <XCircleIcon className="size-8 text-red-600" />
          </div>
          <p className="font-semibold text-lg text-red-700">Payment Failed</p>
          <p className="text-sm text-muted-foreground">
            {paymentError || "Something went wrong. Please try again."}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setPaymentState("idle")}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Idle - show form
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <WalletIcon className="size-4" />
          Checkout
        </CardTitle>
        <CardDescription>Choose how to split and pay</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Split Type */}
        <div className="flex flex-col gap-2">
          <Label>Split Type</Label>
          <Select
            value={splitType}
            onValueChange={(v) =>
              setSplitType((v ?? "full") as "full" | "by_item" | "equal" | "by_amount")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Pay Full Bill</SelectItem>
              <SelectItem value="by_item">Split by Item (pay for what you ate)</SelectItem>
              <SelectItem value="equal">Split Equally</SelectItem>
              <SelectItem value="by_amount">Custom Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Method - visual cards */}
        <div className="flex flex-col gap-2">
          <Label>Payment Method</Label>
          <div className="grid grid-cols-3 gap-2">
            {(["mobile_money", "card", "cash"] as const).map((m) => {
              const Icon = methodIcons[m]
              return (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-colors",
                    method === m
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Icon className="size-5" />
                  <span className="text-xs font-medium">
                    {methodLabels[m]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Payer Name */}
        <div className="flex flex-col gap-2">
          <Label>Your Name (optional)</Label>
          <Input
            value={payerLabel}
            onChange={(e) => setPayerLabel(e.target.value)}
            placeholder="e.g. Asha"
          />
        </div>

        {/* By Item Selection */}
        {splitType === "by_item" && (
          <div className="flex flex-col gap-2">
            <Label>Select Your Items</Label>
            <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
              {unpaidItems.map((item) => (
                <label
                  key={item.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md border-2 p-2 text-sm transition-colors",
                    selectedItems.includes(item.id)
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems((prev) => [...prev, item.id])
                      } else {
                        setSelectedItems((prev) => prev.filter((id) => id !== item.id))
                      }
                    }}
                    className="size-4"
                  />
                  <span className="flex-1">
                    {item.quantity}x {item.menu_item?.name}
                  </span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(parseFloat(item.unit_price) * item.quantity)} TZS
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Custom Amount */}
        {splitType === "by_amount" && (
          <div className="flex flex-col gap-2">
            <Label>Amount to Pay (TZS)</Label>
            <Input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="0"
            />
          </div>
        )}

        <Separator />

        <div className="flex items-center justify-between">
          <span className="font-semibold">Amount to Pay</span>
          <span className="font-bold text-lg tabular-nums">
            {formatCurrency(amountToPay)} TZS
          </span>
        </div>

        <Button size="lg" onClick={handlePay} disabled={amountToPay <= 0} className="w-full">
          <WalletIcon className="size-4" />
          Pay {formatCurrency(amountToPay)} TZS
        </Button>

        {method === "cash" && (
          <p className="text-center text-xs text-muted-foreground">
            Cash payments require waiter confirmation
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// ===== Receipt Modal =====
function ReceiptModal({
  payment,
  restaurant,
  table,
  session,
  onClose,
}: {
  payment: Payment
  restaurant: Restaurant | null
  table: RestaurantTable
  session: TableSession
  onClose: () => void
}) {
  const vatPercent = parseFloat(restaurant?.vat_percent || "0")
  const amount = parseFloat(payment.amount)
  const vatAmount = vatPercent > 0 ? (amount / (1 + vatPercent / 100)) * (vatPercent / 100) : 0
  const subtotal = amount - vatAmount

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <Card className="max-w-sm w-full max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircleIcon className="size-6 text-emerald-600" />
          </div>
          <CardTitle className="text-lg">Payment Receipt</CardTitle>
          <CardDescription>
            {restaurant?.name || "Restaurant"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="text-center">
            <p className="font-bold">{restaurant?.name}</p>
            {restaurant?.address && (
              <p className="text-xs text-muted-foreground">{restaurant.address}</p>
            )}
            {restaurant?.phone && (
              <p className="text-xs text-muted-foreground">{restaurant.phone}</p>
            )}
          </div>

          <Separator />

          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Receipt #</span>
              <span className="font-mono font-medium">RCP-{payment.id.toString().padStart(6, "0")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{new Date(payment.created_at).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Table</span>
              <span className="font-medium">{table.table_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Session</span>
              <span className="font-medium">#{session.id}</span>
            </div>
            {payment.payer_label && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid by</span>
                <span className="font-medium">{payment.payer_label}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method</span>
              <span className="font-medium">{methodLabels[payment.method]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Split Type</span>
              <span className="font-medium">{splitLabels[payment.split_type]}</span>
            </div>
            {payment.transaction_ref && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ref</span>
                <span className="font-mono text-xs">{payment.transaction_ref}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex flex-col gap-1">
            {vatPercent > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="tabular-nums">{formatCurrency(subtotal)} TZS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT ({vatPercent}%)</span>
                  <span className="tabular-nums">{formatCurrency(vatAmount)} TZS</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-base font-bold">
              <span>Total Paid</span>
              <span className="tabular-nums">{formatCurrency(amount)} TZS</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-center gap-2">
            <Badge
              variant={payment.status === "completed" ? "default" : "secondary"}
              className={payment.status === "completed" ? "bg-emerald-600" : ""}
            >
              <CheckIcon className="size-3" />
              {payment.status === "completed" ? "Payment Confirmed" : "Pending Confirmation"}
            </Badge>
          </div>

          {payment.status === "pending" && (
            <p className="text-center text-xs text-muted-foreground">
              Please wait for your waiter to confirm the cash payment.
            </p>
          )}

          <p className="text-center text-xs text-muted-foreground">
            Thank you for dining with us!
          </p>
        </CardContent>
        <CardFooter className="flex gap-2 print:hidden">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            <ArrowLeftIcon className="size-4" />
            Close
          </Button>
          <Button className="flex-1" onClick={handlePrint}>
            <PrinterIcon className="size-4" />
            Print
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
