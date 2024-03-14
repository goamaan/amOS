import { unstable_noStore } from "next/cache"
import { ListDetailView } from "~/app/layout"
import { BookmarkDetail } from "~/components/Bookmark/Bookmark"
import { BookmarksList } from "~/components/Bookmark/BookmarkList"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export default async function Bookmark({ params }: { params: { id: string } }) {
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
      detail={<BookmarkDetail id={params.id} user={session?.user} />}
    />
  )
}
