"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { api } from "~/trpc/react"

export function CreatePost() {
  const router = useRouter()
  const [title, setTitle] = useState("")

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh()
      setTitle("")
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        createPost.mutate({ title, description: "d", slug: "a" })
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPost.isLoading}
      >
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  )
}
