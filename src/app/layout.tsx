import "~/styles/globals.css"

import { Inter } from "next/font/google"
import { cn } from "~/lib/utils"

import { TRPCReactProvider } from "~/trpc/react"
import { Toaster } from "~/components/ui/sonner"

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
          className={`bg-dots ${
            hasDetail ? "hidden lg:flex" : "min-h-screen w-full"
          }`}
        >
          {list}
        </div>
      )}
      {detail}
    </div>
  )
}

export function SiteLayout({ children }: { children: React.ReactElement }) {
  return (
    <div className="relative flex h-full min-h-screen w-full">
      {/* <Sidebar /> */}

      <div className="flex flex-1">{children}</div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          inter.variable,
        )}
      >
        <TRPCReactProvider>
          {children}
          <Toaster
            visibleToasts={3}
            toastOptions={{
              style: { paddingRight: "20px", paddingLeft: "20px" },
            }}
            richColors={true}
            duration={3000}
            closeButton={true}
            position="top-center"
          />
        </TRPCReactProvider>
      </body>
    </html>
  )
}
