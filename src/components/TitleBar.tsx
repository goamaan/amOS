"use client"

import { ArrowLeft, Menu, X } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { useGlobalNavigation } from "~/components/providers/navigation-provider"
import { cn } from "~/lib/utils"

interface Props {
  title: string
  globalMenu?: boolean
  backButtonHref?: string
  children?: React.ReactNode
  hasBgColor?: boolean
  trailingAccessory?: React.ReactNode
}

export function TitleBar({
  title,
  globalMenu = true,
  hasBgColor = true,
  backButtonHref,
  trailingAccessory = null,
  children,
}: Props) {
  const { isOpen, setIsOpen } = useGlobalNavigation()

  return (
    <>
      <div
        className={cn(
          "h-12 min-h-12",
          hasBgColor && "bg-secondary/30",
          `sticky top-0 z-10 flex w-full flex-col justify-center px-3 py-2 backdrop-blur-md`,
        )}
      >
        <div className="flex flex-none items-center justify-between">
          <span className="flex items-center space-x-3">
            {globalMenu && (
              <span
                onClick={() => setIsOpen(!isOpen)}
                className="flex cursor-pointer items-center justify-center rounded-md p-2 lg:hidden"
              >
                {isOpen ? (
                  <X size={16} className="text-primary" />
                ) : (
                  <Menu size={16} className="text-primary" />
                )}
              </span>
            )}
            {backButtonHref && (
              <Link
                href={backButtonHref}
                className="flex items-center justify-center rounded-md p-2 text-primary lg:hidden"
              >
                <ArrowLeft size={16} className="text-primary" />
              </Link>
            )}
            <h2 className="line-clamp-1 transform-gpu text-sm font-semibold text-primary">
              {title}
            </h2>
          </span>

          {trailingAccessory && <>{trailingAccessory}</>}
        </div>

        <div>{children}</div>
      </div>
    </>
  )
}
