"use client"

import { useEffect } from "react"
import { RefreshCwIcon, HomeIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
        <RefreshCwIcon className="size-8 text-destructive" />
      </div>
      <div className="text-center">
        <h2 className="mb-2 text-xl font-bold tracking-tight">
          Something went wrong
        </h2>
        <p className="text-sm text-muted-foreground">
          An error occurred while loading this page.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>
          <RefreshCwIcon className="mr-2 size-4" />
          Try Again
        </Button>
        <Link href="/dashboard">
          <Button variant="outline">
            <HomeIcon className="mr-2 size-4" />
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
