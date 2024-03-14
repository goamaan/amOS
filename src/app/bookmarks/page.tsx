import { ListDetailView } from "~/app/layout"
import { BookmarksList } from "~/components/Bookmark/BookmarkList"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export default async function Bookmarks({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerAuthSession()
  const bookmarks = await api.bookmark.getAll()

  return (
    <ListDetailView
      list={
        <BookmarksList
          bookmarks={bookmarks}
          user={session?.user}
          params={params}
        />
      }
      hasDetail={false}
      detail={null}
    />
  )
}
