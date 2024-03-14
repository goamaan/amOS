import { unstable_noStore } from "next/cache"
import { ListDetailView } from "~/app/layout"
import { StackDetail } from "~/components/Stack/Stack"
import { StackList } from "~/components/Stack/StackList"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export default async function Stack({ params }: { params: { slug: string } }) {
  unstable_noStore()

  const session = await getServerAuthSession()
  const stacks = await api.stack.getAll.query()

  return (
    <ListDetailView
      list={<StackList stacks={stacks} params={params} user={session?.user} />}
      hasDetail
      detail={<StackDetail slug={params.slug} user={session?.user} />}
    />
  )
}
