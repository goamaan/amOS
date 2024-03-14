import { TitleBar } from "~/components/TitleBar"

export function Intro() {
  return (
    <div className="relative flex max-h-screen w-full flex-col overflow-y-auto">
      <TitleBar hasBgColor={false} title="" />
    </div>
  )
}
