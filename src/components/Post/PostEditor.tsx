"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type Post } from "@prisma/client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Editor } from "~/components/editor/editor"
import { SubmitButton } from "~/components/submit-button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { UploadButton } from "~/lib/utils"
import { api } from "~/trpc/react"

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(50, {
      message: "Title must be less than 50 characters.",
    }),
})

export function PostEditor({ post }: { post: Post }) {
  const [content, setContent] = useState(post.content || JSON.stringify({}))
  const [featureImage, setFeatureImage] = useState(
    post.featureImage ?? undefined,
  )
  const { mutateAsync } = api.post.update.useMutation()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await mutateAsync(
      { id: post.id, ...data, content, featureImage },
      {
        onError(error) {
          toast.error(error.message)
        },
        onSuccess(data) {
          toast.success("Post updated")
          router.refresh()
          router.push(`/${data?.type}/${data?.slug}`)
        },
      },
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="featureImage">
                Favicon URL - Upload an image or paste a URL
              </Label>
              <Input
                name="featureImage"
                value={featureImage}
                onChange={(e) => setFeatureImage(e.target.value)}
              />
            </div>
            {featureImage && (
              <Image
                alt="post feature image"
                className="rounded"
                src={featureImage}
                width={100}
                height={100}
              />
            )}
          </div>
          <UploadButton
            className="self-start p-0"
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              const file = res.at(0)
              if (!file) {
                return toast.error("Error uploading file")
              }
              setFeatureImage(file.url)
              return toast.success("File uploaded")
            }}
            onUploadError={(error: Error) => {
              toast.error("error", {
                description: error.message,
              })
            }}
          />
        </div>
        <Editor editable content={content} setContent={setContent} />
        <div className="flex justify-end">
          <SubmitButton
            isPending={form.formState.isSubmitting}
            variant={"default"}
          >
            Update
          </SubmitButton>
        </div>
      </form>
    </Form>
  )
}
