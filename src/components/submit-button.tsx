"use client"

import { Spinner } from "~/components/ui/spinner"
import { Button, type buttonVariants } from "~/components/ui/button"
import { type VariantProps } from "class-variance-authority"
import React from "react"

export function SubmitButton({
  isPending,
  className,
  variant,
  children,
  size,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & {
  isPending: boolean
  className?: string
  variant: VariantProps<typeof buttonVariants>["variant"]
  size?: VariantProps<typeof buttonVariants>["size"]
  children: React.ReactNode
}) {
  return (
    <Button
      {...props}
      size={size}
      variant={variant}
      type="submit"
      aria-disabled={isPending}
      className={className}
    >
      {isPending ? <Spinner /> : children}
    </Button>
  )
}
