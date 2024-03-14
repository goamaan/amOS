import { ListDetailView } from "~/app/layout"
import { QuestionsList } from "~/components/Question/QuestionsList"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export default async function AMA({ params }: { params: { id: string } }) {
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
      hasDetail={false}
      detail={null}
    />
  )
}
