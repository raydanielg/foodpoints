import { Spinner } from "@/components/ui/spinner"

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
      <Spinner className="size-8 text-primary" />
      <p className="shimmer text-sm text-muted-foreground">Loading...</p>
    </div>
  )
}
