import { ListDetailView } from "~/app/layout"
import { Intro } from "~/components/Intro"
import { getServerAuthSession } from "~/server/auth"

export default async function Home() {
  const session = await getServerAuthSession()
  return (
    <ListDetailView
      list={null}
      hasDetail
      detail={<Intro user={session?.user} />}
    />
  )
}
