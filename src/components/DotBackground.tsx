export function DotBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div className="dark:bg-dot-orange-400/[0.3] bg-dot-orange-500/[0.4] relative flex h-full w-full justify-center bg-background">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]"></div>
      {children}
    </div>
  )
}
