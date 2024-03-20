"use client"

import {
  Bookmark,
  Briefcase,
  ExternalLinkIcon,
  FileCode,
  Gamepad2,
  Github,
  Headphones,
  Home,
  Layers,
  Mail,
  MessagesSquare,
  NotebookPen,
  Puzzle,
  Twitter,
  Waypoints,
} from "lucide-react"
import { type Session } from "next-auth"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignInDialog } from "~/components/SignInDialog"
import { ThemeToggle } from "~/components/ThemeToggle"
import { TitleBar } from "~/components/TitleBar"
import { useGlobalNavigation } from "~/components/providers/navigation-provider"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { cn } from "~/lib/utils"

export function Sidebar({ user }: { user?: Session["user"] }) {
  const { isOpen, setIsOpen } = useGlobalNavigation()
  const pathname = usePathname()

  const sections: {
    label: string | null
    items: {
      href: string
      label: string
      icon: JSX.Element
      trailingAccessory: JSX.ElementType | null
      isActive: boolean
      isExternal: boolean
      trigger?: React.ReactNode
    }[]
  }[] = [
    {
      label: null,
      items: [
        {
          href: "/",
          label: "Home",
          icon: <Home />,
          trailingAccessory: null,
          isActive: pathname === "/",
          isExternal: false,
        },
        {
          href: "/writing",
          label: "Writing",
          icon: <NotebookPen />,
          trailingAccessory: null,
          isActive: pathname.indexOf("/writing") >= 0,
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
          icon: <Briefcase />,
          trailingAccessory: null,
          isActive: pathname.indexOf("/work") >= 0,
          isExternal: false,
        },
        {
          href: "/bookmarks",
          label: "Bookmarks",
          icon: <Bookmark />,
          trailingAccessory: null,
          isActive: pathname.indexOf("/bookmarks") >= 0,
          isExternal: false,
        },
        {
          href: "/ama",
          label: "AMA",
          icon: <MessagesSquare />,
          trailingAccessory: null,
          isActive:
            pathname.indexOf("/ama") >= 0 &&
            !pathname.startsWith("/ama/pending"),
          isExternal: false,
        },
        {
          href: "/stack",
          label: "Stack",
          icon: <Layers />,
          trailingAccessory: null,
          isActive: pathname.indexOf("/stack") >= 0,
          isExternal: false,
        },
        {
          href: "/music",
          label: "Music",
          icon: <Headphones />,
          trailingAccessory: null,
          isActive: pathname.indexOf("/music") >= 0,
          isExternal: false,
          trigger: (
            <Link href={"/music"} className="w-full">
              <Button
                variant={
                  pathname.indexOf("/music") >= 0 ? "secondary" : "ghost"
                }
                className={cn(
                  "flex w-full animate-shimmer justify-between gap-2 bg-[length:200%_100%] transition-colors",
                  pathname.indexOf("/music") >= 0
                    ? "bg-[linear-gradient(120deg,#fffcfc,40%,#ffa342,55%,#fffcfc)] dark:bg-[linear-gradient(120deg,#0f0d0b,40%,#803803,45%,#0f0d0b)]"
                    : "bg-[linear-gradient(120deg,#fffcfc,40%,#f2c28f,55%,#fffcfc)] dark:bg-[linear-gradient(120deg,#0f0d0b,40%,#301a03,55%,#0f0d0b)]",
                )}
                size={"sm"}
              >
                <div className="flex items-center gap-2">
                  <span className="flex w-4 items-center justify-center">
                    <Headphones />
                  </span>
                  Music
                </div>
              </Button>
            </Link>
          ),
        },
      ],
    },
    {
      label: "Featured Projects",
      items: [
        {
          href: "https://gistlab.dev",
          label: "GistLab",
          icon: <FileCode />,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          isExternal: true,
        },
        {
          href: "https://astar-visualization.netlify.app/",
          label: "A* Pathfinding",
          icon: <Waypoints />,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          isExternal: true,
        },
        {
          href: "https://github.com/goamaan/tsalgo",
          label: "TSAlgo",
          icon: <Puzzle />,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          isExternal: true,
        },
        {
          href: "https://github.com/goamaan/Titans-Trial",
          label: "Titan's Trial",
          icon: <Gamepad2 />,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
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
          icon: <Twitter />,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          isExternal: true,
        },
        {
          href: "https://github.com/goamaan",
          label: "GitHub",
          icon: <Github />,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          isExternal: true,
        },
        {
          href: "mailto:amaangokak18@gmail.com",
          label: "Mail",
          icon: <Mail />,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          isExternal: true,
        },
      ],
    },
  ]

  return (
    <>
      <nav
        className={cn(
          "3xl:w-80 z-30 flex h-full max-h-screen min-h-screen w-3/4 transform flex-col overflow-y-auto border-r bg-card transition duration-200 ease-in-out sm:w-1/2 sm:pb-0 md:w-1/3 lg:relative lg:z-auto lg:w-56 lg:translate-x-0 2xl:w-72",
          isOpen
            ? "absolute inset-y-0 left-0 translate-x-0 shadow-lg"
            : "absolute -translate-x-full",
        )}
      >
        <div className="flex h-screen flex-col justify-between">
          <div className="flex flex-col">
            <TitleBar
              hasBgColor={false}
              title="Amaan Gokak"
              trailingAccessory={
                <div className="flex gap-1">
                  <ThemeToggle />
                </div>
              }
            />
            <div className="flex flex-col gap-2 space-y-1 px-2">
              {sections.map((section, i) => {
                return (
                  <ul key={i} className="space-y-2 py-2">
                    {section.label && (
                      <h4 key={i} className="px-3 text-xs font-bold">
                        {section.label}
                      </h4>
                    )}
                    <div className="flex flex-col gap-2">
                      {section.items.map(
                        ({
                          href,
                          icon: Icon,
                          isExternal,
                          label,
                          trailingAccessory: Accessory,
                          isActive,
                        }) => (
                          <li
                            className="flex space-x-1"
                            onClick={() => setIsOpen(false)}
                            key={href}
                          >
                            <Link
                              href={href}
                              className="w-full"
                              target={isExternal ? "_blank" : undefined}
                              rel={
                                isExternal ? "noopener noreferrer" : undefined
                              }
                            >
                              <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                  "flex w-full justify-between gap-2",
                                  isActive &&
                                    "animate-shimmer bg-[linear-gradient(120deg,#fffcfc,40%,#ffa342,55%,#fffcfc)] bg-[length:200%_100%] transition-colors dark:bg-[linear-gradient(120deg,#0f0d0b,40%,#803803,45%,#0f0d0b)]",
                                )}
                                size={"sm"}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="flex w-4 items-center justify-center">
                                    {Icon}
                                  </span>
                                  {label}
                                </div>
                                {Accessory && (
                                  <span className="flex w-4 items-center justify-center text-black text-opacity-40 dark:text-white">
                                    <Accessory />
                                  </span>
                                )}
                              </Button>
                            </Link>
                          </li>
                        ),
                      )}
                    </div>
                  </ul>
                )
              })}
            </div>
          </div>
          {!user ? <SignInDialog /> : null}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="m-2 flex items-center justify-between rounded-md bg-secondary/50 px-3 py-1">
                  <div className="flex flex-col items-start justify-start gap-0.5">
                    <p className="text-xs text-muted-foreground">
                      Logged in as
                    </p>
                    <p className="text-sm font-semibold text-muted-foreground">
                      {user.username}
                    </p>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image ?? undefined} />
                    <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user.id}`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
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
