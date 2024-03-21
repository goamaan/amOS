import { ListDetailView } from "~/app/layout"
import { PostsList } from "~/components/Post/PostsList"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export default async function Writing({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: Record<string, string | undefined>
}) {
  const session = await getServerAuthSession()
  const posts = await api.post.getAll({ type: "writing" })
  const tags = await api.post.getTags()
  const filter = searchParams.filter ?? undefined

  return (
    <ListDetailView
      list={
        <PostsList
          currentFilter={filter}
          filters={tags.map((tag) => tag.name).filter((tag) => tag !== "Work")}
          type="writing"
          posts={posts}
          user={session?.user}
          params={params}
        />
      }
      hasDetail={false}
      detail={null}
    />
  )
}
