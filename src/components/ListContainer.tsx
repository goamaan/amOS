export function ListContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full max-h-screen min-h-screen w-full flex-none overflow-y-auto border-r lg:w-80 xl:w-96">
      {children}
    </div>
  )
}
