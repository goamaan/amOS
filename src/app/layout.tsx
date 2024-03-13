import "~/styles/globals.css"

import { Inter } from "next/font/google"
import { cn } from "~/lib/utils"

import { TRPCReactProvider } from "~/trpc/react"
import { Toaster } from "~/components/ui/sonner"
import { ThemeProvider } from "~/components/providers/theme-provider"
import { Sidebar } from "~/components/Sidebar"
import { getServerAuthSession } from "~/server/auth"
import { GlobalNavigationProvider } from "~/components/providers/navigation-provider"
import { TooltipProvider } from "~/components/ui/tooltip"
import { unstable_noStore } from "next/cache"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import ProgressProvider from "~/components/providers/progress-provider"
import { imageFileRouter } from "~/app/api/uploadthing/core"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "Amaan Gokak",
  description: "My personal website",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

interface Props {
  list: React.ReactElement | null
  detail: React.ReactElement | null
  hasDetail?: boolean
}

export function ListDetailView({ list, detail, hasDetail = false }: Props) {
  return (
    <div className="flex w-full">
      {list && (
        <div
          id="list"
          className={cn(
            "bg-background",
            hasDetail ? "hidden lg:flex" : "min-h-screen w-full",
          )}
        >
          {list}
        </div>
      )}
      {detail}
    </div>
  )
}

export async function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession()

  return (
    <div className="relative flex h-full min-h-screen w-full">
      <Sidebar user={session?.user} />

      <div className="flex flex-1">{children}</div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  unstable_noStore()
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <TRPCReactProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider
              disableHoverableContent
              delayDuration={500}
              skipDelayDuration={0}
            >
              <GlobalNavigationProvider>
                <SiteLayout>
                  <ProgressProvider />
                  <NextSSRPlugin
                    /**
                     * The `extractRouterConfig` will extract **only** the route configs
                     * from the router to prevent additional information from being
                     * leaked to the client. The data passed to the client is the same
                     * as if you were to fetch `/api/uploadthing` directly.
                     */
                    routerConfig={extractRouterConfig(imageFileRouter)}
                  />
                  {children}
                </SiteLayout>
                <Toaster
                  visibleToasts={3}
                  toastOptions={{
                    style: { paddingRight: "20px", paddingLeft: "20px" },
                  }}
                  richColors={true}
                  duration={3000}
                  closeButton={true}
                  position="bottom-right"
                />
              </GlobalNavigationProvider>
            </TooltipProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
