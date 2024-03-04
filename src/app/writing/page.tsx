import { ListDetailView } from "~/app/layout"
import { PostsList } from "~/components/PostsList"

export default function Writing({ params }: { params: { slug: string } }) {
  return (
    <ListDetailView
      list={<PostsList params={params} />}
      hasDetail={false}
      detail={null}
    />
  )
}
