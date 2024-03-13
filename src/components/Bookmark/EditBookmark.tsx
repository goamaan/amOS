"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type Bookmark } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Spinner } from "~/components/ui/spinner"
import { Textarea } from "~/components/ui/textarea"
import { UploadDropzone } from "~/lib/utils"
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
  description: z
    .string()
    .min(2, {
      message: "Description must be at least 2 characters.",
    })
    .max(300, {
      message: "Description must be less than 300 characters.",
    }),
  url: z.string().url("Must be a valid URL"),
  host: z.string().min(1),
  tagId: z.string().min(1),
})

export function EditBookmarkForm({ bookmark }: { bookmark: Bookmark }) {
  const [faviconUrl, setFaviconUrl] = useState<string | undefined>(
    bookmark.faviconUrl ?? undefined,
  )
  const { data: tags, isFetching } = api.bookmark.getTags.useQuery()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: bookmark.title,
      description: bookmark.description,
      url: bookmark.url,
      host: bookmark.host,
      tagId: bookmark.tagId,
    },
  })

  const router = useRouter()

  const { mutateAsync } = api.bookmark.update.useMutation()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    return mutateAsync(
      { ...values, faviconUrl, id: bookmark.id },
      {
        onError(error) {
          toast.error(error.message)
        },
        onSuccess(data) {
          toast.success("Bookmark updated")
          router.refresh()
          router.push(`/bookmarks/${data?.id}`)
        },
      },
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tagId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tag for this bookmark" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isFetching ? (
                    <Spinner />
                  ) : (
                    tags?.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="host"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Host</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          <Label>Favicon URL - Upload an image or paste a URL</Label>
          <Input
            name="faviconUrl"
            value={faviconUrl}
            onChange={(e) => setFaviconUrl(e.target.value)}
          />
          <UploadDropzone
            className="p-0"
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              const file = res.at(0)
              if (!file) {
                return toast.error("Error uploading file")
              }
              setFaviconUrl(file.url)
              return toast.success("File uploaded")
            }}
            onUploadError={(error: Error) => {
              toast.error("error", {
                description: error.message,
              })
            }}
          />
        </div>
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
