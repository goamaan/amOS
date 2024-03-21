export function DotBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative flex h-full w-full justify-center bg-background bg-grid-cyan-400/[0.25] dark:bg-grid-cyan-800/[0.15]">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_35%,black)]"></div>
      {children}
    </div>
  )
}
