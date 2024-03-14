import { unstable_noStore } from "next/cache"
import { ListDetailView } from "~/app/layout"
import { Post } from "~/components/Post/Post"
import { PostsList } from "~/components/Post/PostsList"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export default async function WorkPost({
  params,
}: {
  params: { slug: string }
}) {
  unstable_noStore()
  const session = await getServerAuthSession()

  const posts = await api.post.getAll.query({ type: "work" })

  return (
    <ListDetailView
      list={
        <PostsList
          type="work"
          posts={posts}
          user={session?.user}
          params={params}
        />
      }
      hasDetail
      detail={<Post slug={params.slug} user={session?.user} />}
    />
  )
}
