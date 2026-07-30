import Link from "next/link"
import Image from "next/image"
import { HomeIcon, SearchIcon, ArrowLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
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
        {/* 404 illustration */}
        <div className="relative mb-8">
          <h1 className="text-[120px] font-bold leading-none tracking-tighter text-primary/20 sm:text-[160px]">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10 backdrop-blur sm:size-24">
              <SearchIcon className="size-10 text-primary sm:size-12" />
            </div>
          </div>
        </div>

        <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Page not found
        </h2>
        <p className="mb-8 text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It may have been
          moved or no longer exists.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <HomeIcon className="mr-2 size-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <ArrowLeftIcon className="mr-2 size-4" />
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
