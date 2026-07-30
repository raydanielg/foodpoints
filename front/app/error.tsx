"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { HomeIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Error({
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <Image
          src="/food-irradiation.png"
          alt="FoodPoint"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <span className="text-xl font-bold tracking-tight">FoodPoint</span>
      </Link>

      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-8 flex size-20 items-center justify-center rounded-2xl bg-destructive/10 sm:size-24">
          <RefreshCwIcon className="size-10 text-destructive sm:size-12" />
        </div>

        <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Something went wrong
        </h2>
        <p className="mb-8 text-muted-foreground">
          An unexpected error occurred. Please try again, or return to the home
          page if the problem persists.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={reset} className="w-full sm:w-auto">
            <RefreshCwIcon className="mr-2 size-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <HomeIcon className="mr-2 size-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
