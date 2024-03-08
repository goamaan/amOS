import { unstable_noStore } from "next/cache"
import { ListDetailView } from "~/app/layout"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export default async function Bookmarks() {
  unstable_noStore()

  const session = await getServerAuthSession()
  const posts = await api.bookmark.getAll.query({ type: "writing" })

  return <ListDetailView list={null} hasDetail detail={<div></div>} />
}
