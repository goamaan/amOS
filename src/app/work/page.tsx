import { unstable_noStore } from "next/cache"
import { ListDetailView } from "~/app/layout"
import { PostsList } from "~/components/Post/PostsList"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export default async function Work({ params }: { params: { slug: string } }) {
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
      hasDetail={false}
      detail={null}
    />
  )
}
