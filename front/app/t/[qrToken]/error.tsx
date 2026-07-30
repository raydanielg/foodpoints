"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { HomeIcon, ArrowLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function CustomerError({
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
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
          <span className="text-3xl">!</span>
        </div>

        <h2 className="mb-3 text-2xl font-bold tracking-tight">
          Unable to load menu
        </h2>
        <p className="mb-8 text-muted-foreground">
          We couldn't load the restaurant menu. Please try again or ask your
          waiter for assistance.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={reset} className="w-full sm:w-auto">
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <ArrowLeftIcon className="mr-2 size-4" />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
