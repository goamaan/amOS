import { TitleBar } from "~/components/TitleBar"
import { Editor } from "~/components/editor/editor"

export function Intro() {
  return (
    <div className="relative flex max-h-screen w-full flex-col overflow-y-auto">
      <TitleBar hasBgColor={false} title="" />
    </div>
  )
}
