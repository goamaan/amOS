import { ListDetailView } from "~/app/layout"
import { QuestionDetail } from "~/components/Question/Question"
import { QuestionsList } from "~/components/Question/QuestionsList"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export default async function AMAQuestion({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerAuthSession()
  const questions = await api.question.getAll()

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
