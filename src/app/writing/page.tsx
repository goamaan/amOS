import { ListDetailView } from "~/app/layout"
import { PostsList } from "~/components/Post/PostsList"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export default async function Writing({
  params,
}: {
  params: { slug: string }
}) {
  const session = await getServerAuthSession()
  const posts = await api.post.getAll({ type: "writing" })

  return (
    <ListDetailView
      list={
        <PostsList
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
