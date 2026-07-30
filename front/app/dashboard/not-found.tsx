import Link from "next/link"
import { HomeIcon, ArrowLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function DashboardNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold tracking-tighter text-primary/20">
          404
        </h1>
        <h2 className="mb-2 text-xl font-bold tracking-tight">
          Page not found
        </h2>
        <p className="text-sm text-muted-foreground">
          The page you're looking for doesn't exist in the dashboard.
        </p>
      </div>
      <Link href="/dashboard">
        <Button>
          <HomeIcon className="mr-2 size-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  )
}
