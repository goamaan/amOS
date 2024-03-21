import { ListDetailView } from "~/app/layout"
import { BookmarkDetail } from "~/components/Bookmark/Bookmark"
import { BookmarksList } from "~/components/Bookmark/BookmarkList"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export default async function Bookmark({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: Record<string, string | undefined>
}) {
  const session = await getServerAuthSession()
  const bookmarks = await api.bookmark.getAll()

  const tags = await api.bookmark.getTags()
  const filter = searchParams.filter ?? undefined

  return (
    <ListDetailView
      list={
        <BookmarksList
          currentFilter={filter}
          filters={tags.map((tag) => tag.name)}
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
