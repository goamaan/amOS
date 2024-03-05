import { type Session } from "next-auth"
import { DeletePost } from "~/components/Post/DeletePost"
import { PostTitle } from "~/components/Post/PostTitle"
import { PostEditor } from "~/components/Post/PostEditor"
import { TitleBar } from "~/components/TitleBar"
import { api } from "~/trpc/server"
import { PublishPost } from "~/components/Post/PublishPost"
import { UnpublishPost } from "~/components/Post/UnpublishPost"

export async function Post({
  slug,
  user,
}: {
  slug: string
  user?: Session["user"]
}) {
  const post = await api.post.get.query({ slug })

  return (
    <div className="relative flex max-h-screen w-full flex-col items-center space-y-4 overflow-y-auto">
      <TitleBar hasBgColor={false} title="" />
      <div className="flex w-[85%] items-center justify-start gap-4">
        <PostTitle post={post} user={user} />
        {user?.isAdmin && <DeletePost id={post.id} />}
        {user?.isAdmin &&
          (post.published ? (
            <UnpublishPost id={post.id} />
          ) : (
            <PublishPost id={post.id} />
          ))}
      </div>
      <PostEditor post={post} user={user} />
    </div>
  )
}
