import { unstable_noStore } from "next/cache"
import { ListDetailView } from "~/app/layout"
import { PostsList } from "~/components/PostsList"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export const dynamic = "force-dynamic"

export default async function Writing({
  params,
}: {
  params: { slug: string }
}) {
  unstable_noStore()

  const session = await getServerAuthSession()
  const posts = await api.post.getAll.query()

  return (
    <ListDetailView
      list={<PostsList posts={posts} user={session?.user} params={params} />}
      hasDetail={false}
      detail={null}
    />
  )
}
