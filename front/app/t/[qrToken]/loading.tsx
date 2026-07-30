import { Spinner } from "@/components/ui/spinner"

export default function CustomerLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
      <Spinner className="size-10 text-primary" />
      <p className="text-sm font-medium text-muted-foreground">
        Loading menu...
      </p>
    </div>
  )
}
