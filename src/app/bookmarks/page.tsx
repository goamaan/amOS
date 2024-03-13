import { unstable_noStore } from "next/cache"
import { ListDetailView } from "~/app/layout"
import { BookmarksList } from "~/components/Bookmark/BookmarkList"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export default async function Bookmarks({
  params,
}: {
  params: { id: string }
}) {
  unstable_noStore()

  const session = await getServerAuthSession()
  const bookmarks = await api.bookmark.getAll.query()

  return (
    <ListDetailView
      list={
        <BookmarksList
          bookmarks={bookmarks}
          user={session?.user}
          params={params}
        />
      }
      hasDetail
      detail={<div></div>}
    />
  )
}
