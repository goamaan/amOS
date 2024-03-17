"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Editor } from "~/components/editor/editor"
import { SubmitButton } from "~/components/submit-button"
import { api } from "~/trpc/react"

export function IntroEditor({
  intro,
}: {
  intro: { id: string; content: string }
}) {
  const [content, setContent] = useState(intro.content)
  const { mutateAsync, isPending } = api.user.updateIntro.useMutation()
  const router = useRouter()

  const onSubmit = async (content: string) => {
    await mutateAsync(
      { id: intro.id, content },
      {
        onError(error) {
          toast.error(error.message)
        },
        onSuccess() {
          toast.success("Post updated")
          router.refresh()
        },
      },
    )
  }

  return (
    <div className="col-span-10 space-y-4">
      <Editor editable content={content} setContent={setContent} />
      <SubmitButton
        onClick={() => onSubmit(content)}
        isPending={isPending}
        variant={"default"}
      >
        Update
      </SubmitButton>
    </div>
  )
}
