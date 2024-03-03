import { ListDetailView } from "~/app/layout"
import { PostsList } from "~/components/PostsList"

export default function Writing() {
  return <ListDetailView list={<PostsList />} hasDetail={false} detail={null} />
}
