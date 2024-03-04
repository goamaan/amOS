import { ListDetailView } from "~/app/layout"
import { WorkList } from "~/components/WorkList"

export default function Work() {
  return <ListDetailView list={<WorkList />} hasDetail={false} detail={null} />
}
