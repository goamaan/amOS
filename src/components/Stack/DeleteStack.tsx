"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { DeleteDialog } from "~/components/DeleteDialog"
import { SubmitButton } from "~/components/submit-button"
import { Form } from "~/components/ui/form"
import { api } from "~/trpc/react"

const formSchema = z.object({
  id: z.string(),
})

export function DeleteStack({ id }: { id: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id,
    },
  })

  const router = useRouter()

  const { mutateAsync } = api.stack.delete.useMutation()

  function onSubmit(values: z.infer<typeof formSchema>) {
    return mutateAsync(values, {
      onError(error) {
        toast.error(error.message)
      },
      onSuccess() {
        toast.success("Stack deleted")
        router.refresh()
        router.push(`/stack`)
      },
    })
  }

  return (
    <div className="flex justify-center">
      <DeleteDialog>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <SubmitButton
              variant={"destructive"}
              className="w-fit"
              isPending={form.formState.isSubmitting}
            >
              Delete
            </SubmitButton>
          </form>
        </Form>
      </DeleteDialog>
    </div>
  )
}
