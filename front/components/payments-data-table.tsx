"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CheckCircleFillIcon,
  DotsVerticalIcon,
  GripVerticalIcon,
  LayoutColumnsIcon,
  PlusIcon,
  TrendingUpIcon,
  ClockIcon,
  XCircleIcon,
  SmartphoneIcon,
  CreditCardIcon,
  BanknoteIcon,
  CheckIcon,
} from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { api, type Payment } from "@/lib/api"
import { toast } from "@/components/ui/toast"

function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "0"
  return num.toLocaleString()
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getMethodIcon(method: string) {
  switch (method) {
    case "mobile_money":
      return <SmartphoneIcon className="size-3.5 text-blue-500" />
    case "card":
      return <CreditCardIcon className="size-3.5 text-purple-500" />
    case "cash":
      return <BanknoteIcon className="size-3.5 text-emerald-500" />
    default:
      return null
  }
}

function getMethodLabel(method: string) {
  switch (method) {
    case "mobile_money":
      return "Mobile Money"
    case "card":
      return "Card"
    case "cash":
      return "Cash"
    default:
      return method
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="outline" className="gap-1 px-1.5 text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30">
          <CheckCircleFillIcon className="size-3 fill-emerald-500" />
          Completed
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="gap-1 px-1.5 text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/30">
          <ClockIcon className="size-3" />
          Pending
        </Badge>
      )
    case "failed":
      return (
        <Badge variant="outline" className="gap-1 px-1.5 text-red-600 border-red-200 bg-red-50 dark:bg-red-950/30">
          <XCircleIcon className="size-3" />
          Failed
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id })
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const chartConfig = {
  amount: {
    label: "Payment Amount",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function PaymentDetailDrawer({
  payment,
  onConfirmCash,
}: {
  payment: Payment
  onConfirmCash: (id: number) => Promise<void>
}) {
  const isMobile = useIsMobile()
  const [confirming, setConfirming] = React.useState(false)

  const chartData = React.useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      label: `T-${6 - i}`,
      amount: i === 5 ? parseFloat(payment.amount) : Math.max(0, parseFloat(payment.amount) * (0.6 + Math.random() * 0.5)),
    }))
  }, [payment.id])

  const handleConfirm = async () => {
    setConfirming(true)
    try {
      await onConfirmCash(payment.id)
    } finally {
      setConfirming(false)
    }
  }

  return (
    <Drawer swipeDirection={isMobile ? "down" : "right"}>
      <DrawerTrigger
        render={
          <Button variant="link" className="w-fit px-0 text-left text-foreground font-medium">
            {formatCurrency(payment.amount)} TZS
          </Button>
        }
      />
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle className="flex items-center gap-2">
            {getMethodIcon(payment.method)}
            Payment #{payment.id}
          </DrawerTitle>
          <DrawerDescription>
            Payment details and transaction history
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig} className="aspect-auto h-[160px] w-full">
                <AreaChart data={chartData} margin={{ left: 0, right: 10, top: 5 }}>
                  <defs>
                    <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} hide />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Area dataKey="amount" type="natural" fill="url(#fillAmount)" stroke="var(--color-amount)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Payment amount: {formatCurrency(payment.amount)} TZS
                  <TrendingUpIcon className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  {getMethodLabel(payment.method)} payment via {payment.split_type.replace(/_/g, " ")} split.
                  {payment.payer_label && ` Paid by ${payment.payer_label}.`}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Payment Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="font-bold tabular-nums">{formatCurrency(payment.amount)} TZS</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Method</p>
              <p className="font-medium flex items-center gap-1.5">
                {getMethodIcon(payment.method)}
                {getMethodLabel(payment.method)}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Split Type</p>
              <p className="font-medium capitalize">{payment.split_type.replace(/_/g, " ")}</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Status</p>
              {getStatusBadge(payment.status)}
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Payer</p>
              <p className="font-medium">{payment.payer_label || "—"}</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Table</p>
              <p className="font-medium">{payment.session?.table?.name || "—"}</p>
            </div>
            {payment.payer_phone && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium">{payment.payer_phone}</p>
              </div>
            )}
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium">{formatDateTime(payment.created_at)}</p>
            </div>
            {payment.transaction_ref && (
              <div className="rounded-lg bg-muted/50 p-3 col-span-2">
                <p className="text-xs text-muted-foreground">Transaction Ref</p>
                <p className="font-mono text-xs">{payment.transaction_ref}</p>
              </div>
            )}
            {payment.snippe_reference && (
              <div className="rounded-lg bg-muted/50 p-3 col-span-2">
                <p className="text-xs text-muted-foreground">Snippe Reference</p>
                <p className="font-mono text-xs">{payment.snippe_reference}</p>
              </div>
            )}
          </div>

          {/* Commission Info */}
          {payment.status === "completed" && (
            <div className="rounded-lg border border-blue-200 bg-blue-50/50 dark:bg-blue-950/10 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Platform Commission (1.5%)</span>
                <span className="font-medium text-red-500">-{formatCurrency(parseFloat(payment.amount) * 0.015)} TZS</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-muted-foreground">Net Earning</span>
                <span className="font-bold text-emerald-600">{formatCurrency(parseFloat(payment.amount) * 0.985)} TZS</span>
              </div>
            </div>
          )}
        </div>

        <DrawerFooter>
          {payment.status === "pending" && payment.method === "cash" && (
            <Button onClick={handleConfirm} disabled={confirming}>
              <CheckIcon className="size-4" />
              {confirming ? "Confirming..." : "Confirm Cash Payment"}
            </Button>
          )}
          <DrawerClose render={<Button variant="outline">Close</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function DraggableRow({
  row,
  onConfirmCash,
}: {
  row: Row<Payment>
  onConfirmCash: (id: number) => Promise<void>
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function PaymentsDataTable({
  data: payments,
  onConfirmCash,
}: {
  data: Payment[]
  onConfirmCash: (id: number) => Promise<void>
}) {
  const [data, setData] = React.useState(() => payments)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  React.useEffect(() => {
    setData(payments)
  }, [payments])

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const columns: ColumnDef<Payment>[] = React.useMemo(() => [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
      size: 40,
    },
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: "amount",
      header: () => <div className="w-full text-right">Amount</div>,
      cell: ({ row }) => (
        <PaymentDetailDrawer payment={row.original} onConfirmCash={onConfirmCash} />
      ),
      enableHiding: false,
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          {getMethodIcon(row.original.method)}
          <span className="text-sm">{getMethodLabel(row.original.method)}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "split_type",
      header: "Split",
      cell: ({ row }) => (
        <Badge variant="outline" className="px-1.5 text-muted-foreground capitalize">
          {row.original.split_type.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "payer_label",
      header: "Payer",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.payer_label || "—"}
        </span>
      ),
    },
    {
      id: "table",
      accessorFn: (row) => row.session?.table?.name,
      header: "Table",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.session?.table?.name || "—"}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatDateTime(row.original.created_at)}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                size="icon"
              >
                <DotsVerticalIcon className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            {row.original.status === "pending" && row.original.method === "cash" && (
              <DropdownMenuItem onClick={() => onConfirmCash(row.original.id)}>
                <CheckIcon className="size-4" />
                Confirm Cash
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>Export</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 50,
    },
  ], [onConfirmCash])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  // Filtered counts for tabs
  const allCount = data.length
  const completedCount = data.filter((p) => p.status === "completed").length
  const pendingCount = data.filter((p) => p.status === "pending").length
  const failedCount = data.filter((p) => p.status === "failed").length

  return (
    <Tabs defaultValue="all" className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="all">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="hidden @4xl/main:flex">
          <TabsTrigger value="all">All <Badge variant="secondary" className="ml-1.5">{allCount}</Badge></TabsTrigger>
          <TabsTrigger value="completed">Completed <Badge variant="secondary" className="ml-1.5">{completedCount}</Badge></TabsTrigger>
          <TabsTrigger value="pending">Pending <Badge variant="secondary" className="ml-1.5">{pendingCount}</Badge></TabsTrigger>
          <TabsTrigger value="failed">Failed <Badge variant="secondary" className="ml-1.5">{failedCount}</Badge></TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm">
                  <LayoutColumnsIcon className="size-4" />
                  <span className="hidden lg:inline">Columns</span>
                  <ChevronDownIcon className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === "split_type" ? "Split Type" :
                       column.id === "payer_label" ? "Payer" :
                       column.id === "created_at" ? "Date" :
                       column.id === "method" ? "Method" :
                       column.id === "amount" ? "Amount" :
                       column.id === "status" ? "Status" :
                       column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <TabsContent value="all" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        {renderTable("all")}
      </TabsContent>
      <TabsContent value="completed" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        {renderTable("completed")}
      </TabsContent>
      <TabsContent value="pending" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        {renderTable("pending")}
      </TabsContent>
      <TabsContent value="failed" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        {renderTable("failed")}
      </TabsContent>
    </Tabs>
  )

  function renderTable(filter: string) {
    const filteredData = filter === "all" ? data : data.filter((p) => p.status === filter)
    const filteredTable = useReactTable({
      data: filteredData,
      columns,
      state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
      getRowId: (row) => row.id.toString(),
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    const filteredIds = filteredData.map((p) => p.id)

    return (
      <>
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={`${sortableId}-${filter}`}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {filteredTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {filteredTable.getRowModel().rows?.length ? (
                  <SortableContext
                    items={filteredIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {filteredTable.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} onConfirmCash={onConfirmCash} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <BanknoteIcon className="size-8 opacity-40" />
                        <p>No {filter !== "all" ? filter : ""} payments yet.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        {renderPagination(filteredTable)}
      </>
    )
  }

  function renderPagination(tbl: ReturnType<typeof useReactTable<Payment>>) {
    return (
      <div className="flex items-center justify-between px-4">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {tbl.getFilteredSelectedRowModel().rows.length} of{" "}
          {tbl.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${tbl.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                tbl.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue placeholder={tbl.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {tbl.getState().pagination.pageIndex + 1} of{" "}
            {tbl.getPageCount() || 1}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => tbl.setPageIndex(0)}
              disabled={!tbl.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => tbl.previousPage()}
              disabled={!tbl.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => tbl.nextPage()}
              disabled={!tbl.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => tbl.setPageIndex(tbl.getPageCount() - 1)}
              disabled={!tbl.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
