import { ListDetailView } from "~/app/layout"
import { Intro } from "~/components/Intro"

export default async function Home() {
  return <ListDetailView list={null} hasDetail detail={<Intro />} />
}
