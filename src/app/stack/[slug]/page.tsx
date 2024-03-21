import { ListDetailView } from "~/app/layout"
import { StackDetail } from "~/components/Stack/Stack"
import { StackList } from "~/components/Stack/StackList"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export default async function Stack({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: Record<string, string | undefined>
}) {
  const session = await getServerAuthSession()
  const stacks = await api.stack.getAll()
  const tags = await api.stack.getTags()
  const filter = searchParams.filter ?? undefined

  return (
    <ListDetailView
      list={
        <StackList
          stacks={stacks}
          params={params}
          user={session?.user}
          filters={tags.map((tag) => tag.name)}
          currentFilter={filter}
        />
      }
      hasDetail
      detail={<StackDetail slug={params.slug} user={session?.user} />}
    />
  )
}
