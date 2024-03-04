import { type Session } from "next-auth"
import { TextEditor } from "~/components/TextEditor"
import { TitleBar } from "~/components/TitleBar"
import { api } from "~/trpc/server"

export async function Post({
  slug,
  user,
}: {
  slug: string
  user?: Session["user"]
}) {
  const post = await api.post.get.query({ slug })

  return (
    <div className="relative flex max-h-screen w-full flex-col overflow-y-auto">
      <TitleBar hasBgColor={false} title="" />

      <TextEditor />
    </div>
  )
}
