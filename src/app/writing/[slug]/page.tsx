import { ListDetailView } from "~/app/layout"
import { Post } from "~/components/Post"
import { PostsList } from "~/components/PostsList"
import { getServerAuthSession } from "~/server/auth"

export default async function WritingPost({
  params,
}: {
  params: { slug: string }
}) {
  const session = await getServerAuthSession()

  return (
    <ListDetailView
      list={<PostsList params={params} />}
      hasDetail
      detail={<Post slug={params.slug} user={session?.user} />}
    />
  )
}
