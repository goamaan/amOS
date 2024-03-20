export function DotBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div className="dark:bg-grid-orange-800/[0.2] bg-grid-orange-200/[0.3] relative flex h-full w-full justify-center bg-background">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_35%,black)]"></div>
      {children}
    </div>
  )
}
