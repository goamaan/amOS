"use client" // Error components must be Client Components

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "~/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto mt-20 flex flex-col items-center gap-4">
      <h2 className="font-mono text-2xl font-semibold">
        Something went wrong!
      </h2>
      <div className="flex gap-2">
        <Button
          variant={"outline"}
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
        <Link href={"/"}>
          <Button variant={"default"}>Back to home</Button>
        </Link>
      </div>
    </div>
  )
}
