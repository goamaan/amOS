import { ArrowLeft, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import * as React from "react"
import { useGlobalNavigation } from "~/components/providers/navigation-provider"
import { cn } from "~/lib/utils"

interface Props {
  title: string
  globalMenu?: boolean
  backButton?: boolean
  backButtonHref?: string
  magicTitle?: boolean
  titleRef?: React.MutableRefObject<HTMLParagraphElement> | null
  scrollContainerRef?: React.MutableRefObject<HTMLDivElement> | null
  children?: React.ReactNode
  leadingAccessory?: React.ReactNode
  trailingAccessory?: React.ReactNode
}

export function TitleBar({
  title,
  globalMenu = true,
  backButtonHref,
  magicTitle = false,
  titleRef = null,
  scrollContainerRef = null,
  leadingAccessory = null,
  trailingAccessory = null,
  children,
}: Props) {
  const { isOpen, setIsOpen } = useGlobalNavigation()
  const [offset, setOffset] = React.useState(200)
  const { theme } = useTheme()
  const [opacity, _setOpacity] = React.useState(0)
  const [currentScrollOffset, _setCurrentScrollOffset] = React.useState(0)
  const [initialTitleOffsets, _setInitialTitleOffsets] = React.useState({
    top: 0,
    bottom: 0,
  })

  const initialTitleOffsetsRef = React.useRef(initialTitleOffsets)
  const setInitialTitleOffsets = React.useCallback(
    (data: typeof initialTitleOffsets) => {
      initialTitleOffsetsRef.current = data
      _setInitialTitleOffsets(data)
    },
    [],
  )

  const opacityRef = React.useRef(opacity)
  const setOpacity = React.useCallback((data: typeof opacity) => {
    opacityRef.current = data
    _setOpacity(data)
  }, [])

  const currentScrollOffsetRef = React.useRef(currentScrollOffset)
  const setCurrentScrollOffset = React.useCallback(
    (data: typeof currentScrollOffset) => {
      currentScrollOffsetRef.current = data
      _setCurrentScrollOffset(data)
    },
    [],
  )

  const handler = React.useCallback(() => {
    const shadowOpacity = scrollContainerRef!.current.scrollTop / 200
    setCurrentScrollOffset(shadowOpacity > 0.12 ? 0.12 : shadowOpacity)

    if (!titleRef?.current || !initialTitleOffsetsRef?.current) return

    const titleTop = titleRef.current.getBoundingClientRect().top - 48
    const titleBottom = titleRef.current.getBoundingClientRect().bottom - 56
    const initialOffsets = initialTitleOffsetsRef.current

    const offsetAmount =
      parseFloat((titleBottom / initialOffsets.bottom).toFixed(2)) * 100

    const opacityOffset =
      parseFloat((titleTop / initialOffsets.top).toFixed(2)) * -1

    setOffset(Math.min(Math.max(offsetAmount, 0), 100))
    setOpacity(opacityOffset)
  }, [titleRef, scrollContainerRef, setCurrentScrollOffset, setOpacity])

  React.useEffect(() => {
    const ref = scrollContainerRef
    scrollContainerRef?.current?.addEventListener("scroll", handler)
    return () => ref!.current?.removeEventListener("scroll", handler)
  }, [title, titleRef, scrollContainerRef, handler])

  React.useEffect(() => {
    if (!titleRef?.current || !scrollContainerRef?.current) return
    scrollContainerRef.current.scrollTop = 0
    setOpacity(0)
    setInitialTitleOffsets({
      bottom: titleRef.current.getBoundingClientRect().bottom - 56,
      top: titleRef.current.getBoundingClientRect().top - 48,
    })
  }, [title, titleRef, scrollContainerRef, setOpacity, setInitialTitleOffsets])

  return (
    <>
      <div
        style={{
          boxShadow: `0 1px 3px rgba(0,0,0,${currentScrollOffset})`,
        }}
        className={cn(
          "min-h-12 bg-background",
          currentScrollOffset === 0
            ? currentScrollOffset
            : theme === "dark"
              ? currentScrollOffset + 0.5
              : currentScrollOffset + 0.8,
          `filter-blur sticky top-0 z-10 flex flex-col justify-center px-3 py-2 dark:border-b dark:border-gray-900`,
        )}
      >
        <div className="flex flex-none items-center justify-between">
          <span className="flex items-center space-x-3">
            {globalMenu && (
              <span
                onClick={() => setIsOpen(!isOpen)}
                className="flex cursor-pointer items-center justify-center rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-800 lg:hidden"
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
                className="flex items-center justify-center rounded-md p-2 text-primary hover:bg-gray-200 dark:hover:bg-gray-800 lg:hidden"
              >
                <ArrowLeft size={16} className="text-primary" />
              </Link>
            )}

            {leadingAccessory && <>{leadingAccessory}</>}

            <h2
              style={
                magicTitle
                  ? {
                      transform: `translateY(${offset}%)`,
                      opacity: `${opacity}`,
                    }
                  : {}
              }
              className="line-clamp-1 transform-gpu text-sm font-bold text-primary"
            >
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
