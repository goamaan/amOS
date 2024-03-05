import { unstable_noStore } from "next/cache"
import { ListDetailView } from "~/app/layout"
import { Intro } from "~/components/Intro"

export const dynamic = "force-dynamic"

export default async function Home() {
  unstable_noStore()
  return <ListDetailView list={null} hasDetail detail={<Intro />} />
}
