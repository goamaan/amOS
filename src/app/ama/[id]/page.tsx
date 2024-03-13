import { unstable_noStore } from "next/cache"
import { ListDetailView } from "~/app/layout"
import { QuestionDetail } from "~/components/Question/Question"
import { QuestionsList } from "~/components/Question/QuestionsList"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export const dynamic = "force-dynamic"

export default async function AMAQuestion({
  params,
}: {
  params: { id: string }
}) {
  unstable_noStore()

  const session = await getServerAuthSession()
  const questions = await api.question.getAll.query()

  return (
    <ListDetailView
      list={
        <QuestionsList
          questions={questions}
          user={session?.user}
          params={params}
        />
      }
      hasDetail
      detail={<QuestionDetail id={params.id} user={session?.user} />}
    />
  )
}
