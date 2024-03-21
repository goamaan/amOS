import { ListDetailView } from "~/app/layout"
import { PostsList } from "~/components/Post/PostsList"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export default async function Work({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: Record<string, string | undefined>
}) {
  const session = await getServerAuthSession()
  const posts = await api.post.getAll({ type: "work" })

  const tags = await api.post.getTags()
  const filter = searchParams.filter ?? undefined

  return (
    <ListDetailView
      list={
        <PostsList
          currentFilter={filter}
          filters={tags.map((tag) => tag.name)}
          type="work"
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
