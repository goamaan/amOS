"use client"

import {
  Bookmark,
  Briefcase,
  ExternalLinkIcon,
  FileCode,
  Gamepad2,
  Github,
  Home,
  Layers,
  Mail,
  MessagesSquare,
  NotebookPen,
  PlusCircle,
  Puzzle,
  Twitter,
  Waypoints,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRef, type MutableRefObject } from "react"
import { TitleBar } from "~/components/TitleBar"
import { useGlobalNavigation } from "~/components/providers/navigation-provider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

function AddBookmarkDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <PlusCircle />{" "}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a bookmark</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const { isOpen, setIsOpen } = useGlobalNavigation()
  const pathname = usePathname()

  const scrollContainerRef = useRef<HTMLDivElement>()
  const sections = [
    {
      label: null,
      items: [
        {
          href: "/",
          label: "Home",
          icon: Home,
          trailingAccessory: null,
          isActive: pathname === "/",
          trailingAction: null,
          isExternal: false,
        },
        {
          href: "/writing",
          label: "Writing",
          icon: NotebookPen,
          trailingAccessory: null,
          isActive: pathname.indexOf("/writing") >= 0,
          trailingAction: null,
          isExternal: false,
        },
      ],
    },
    {
      label: "Me",
      items: [
        {
          href: "/work",
          label: "Work",
          icon: Briefcase,
          trailingAccesory: null,
          isActive: pathname.indexOf("/work") >= 0,
          trailingAction: null,
          isExternal: false,
        },
        {
          href: "/bookmarks",
          label: "Bookmarks",
          icon: Bookmark,
          trailingAccessory: null,
          isActive: pathname.indexOf("/bookmarks") >= 0,
          trailingAction: isAdmin ? AddBookmarkDialog : null,
          isExternal: false,
        },

        {
          href: "/ama",
          label: "AMA",
          icon: MessagesSquare,
          trailingAccessory: null,
          isActive:
            pathname.indexOf("/ama") >= 0 &&
            !pathname.startsWith("/ama/pending"),
          trailingAction: null,
          isExternal: false,
        },
        {
          href: "/stack",
          label: "Stack",
          icon: Layers,
          trailingAccessory: null,
          isActive: pathname.indexOf("/stack") >= 0,
          trailingAction: null,
          isExternal: false,
        },
      ],
    },
    {
      label: "Featured Projects",
      items: [
        {
          href: "https://gistlab.dev",
          label: "GistLab",
          icon: FileCode,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          trailingAction: null,
          isExternal: true,
        },
        {
          href: "https://astar-visualization.netlify.app/",
          label: "A* Pathfinding",
          icon: Waypoints,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          trailingAction: null,
          isExternal: true,
        },
        {
          href: "https://github.com/goamaan/tsalgo",
          label: "TSAlgo",
          icon: Puzzle,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          trailingAction: null,
          isExternal: true,
        },
        {
          href: "https://github.com/goamaan/Titans-Trial",
          label: "Titan's Trial",
          icon: Gamepad2,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          trailingAction: null,
          isExternal: true,
        },
      ],
    },
    {
      label: "Online",
      items: [
        {
          href: "https://twitter.com/goamaan",
          label: "Twitter",
          icon: Twitter,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          trailingAction: null,
          isExternal: true,
        },
        {
          href: "https://github.com/goamaan",
          label: "GitHub",
          icon: Github,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          trailingAction: null,
          isExternal: true,
        },
        {
          href: "mailto:amaangokak18@gmail.com",
          label: "Mail",
          icon: Mail,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          trailingAction: null,
          isExternal: true,
        },
      ],
    },
  ]

  return (
    <>
      <nav
        ref={scrollContainerRef as MutableRefObject<HTMLDivElement>}
        className={`${
          isOpen
            ? "absolute inset-y-0 left-0 translate-x-0 shadow-lg"
            : "absolute -translate-x-full"
        } 3xl:w-80 border-gray-150 z-30 flex h-full max-h-screen min-h-screen w-3/4 flex-none transform flex-col overflow-y-auto border-r bg-white pb-10 transition duration-200 ease-in-out dark:border-gray-800 dark:bg-gray-900 sm:w-1/2 sm:pb-0 md:w-1/3 lg:relative lg:z-auto lg:w-56 lg:translate-x-0 lg:bg-gray-50 lg:dark:bg-gray-900 2xl:w-72`}
      >
        <TitleBar
          scrollContainerRef={
            scrollContainerRef as MutableRefObject<HTMLDivElement>
          }
          leadingAccessory={null}
          title="Amaan Gokak"
        />
        <div className="flex-1 space-y-1 px-3 py-3">
          {sections.map((section, i) => {
            return (
              <ul key={i} className="space-y-1">
                {section.label && (
                  <h4
                    key={i}
                    className="text-gray-1000 px-2 pb-2 pt-5 text-xs font-semibold text-opacity-40 dark:text-white"
                  >
                    {section.label}
                  </h4>
                )}
                {section.items.map(
                  ({
                    href,
                    icon: Icon,
                    isActive,
                    isExternal,
                    label,
                    trailingAccessory: Accessory,
                    trailingAction: Action,
                  }) => (
                    <li
                      className="flex items-stretch space-x-1"
                      onClick={() => setIsOpen(false)}
                      key={href}
                    >
                      <Link
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className={`flex flex-1 items-center space-x-3 rounded-md px-2 py-1.5 text-sm font-medium  ${
                          isActive
                            ? "bg-black text-white hover:bg-black hover:text-white dark:bg-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
                            : "text-gray-700 dark:text-gray-200 sm:hover:bg-gray-200 sm:hover:text-gray-900 sm:dark:hover:bg-gray-700 sm:dark:hover:text-gray-200"
                        }`}
                      >
                        <span className="flex w-4 items-center justify-center">
                          <Icon />
                        </span>
                        <span className="flex-1">{label}</span>
                        {Accessory && (
                          <span className="flex w-4 items-center justify-center text-black text-opacity-40 dark:text-white">
                            <Accessory />
                          </span>
                        )}
                      </Link>
                      {Action && <Action />}
                    </li>
                  ),
                )}
              </ul>
            )
          })}
        </div>
        {/* <UserFooter /> */}
      </nav>

      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-10 transition duration-200 ease-in-out dark:bg-opacity-50 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />
    </>
  )
}
