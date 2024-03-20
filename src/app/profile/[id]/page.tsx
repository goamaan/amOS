import { ListDetailView } from "~/app/layout"
import { UserProfile } from "~/components/User/UserProfile"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export default async function Profile({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession()
  const user = await api.user.get({ id: params.id })

  return (
    <ListDetailView
      list={null}
      hasDetail
      detail={<UserProfile currentUser={session?.user} user={user} />}
    />
  )
}
