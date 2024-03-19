import { type Session } from "next-auth"
import { AddComment } from "~/components/Comment/AddComment"
import { CommentList } from "~/components/Comment/CommentList"
import { DotBackground } from "~/components/DotBackground"
import { LikeButton } from "~/components/LikeButton"
import { DeletePost } from "~/components/Post/DeletePost"
import { PostEditor } from "~/components/Post/PostEditor"
import { PostView } from "~/components/Post/PostView"
import { PublishPost } from "~/components/Post/PublishPost"
import { UnpublishPost } from "~/components/Post/UnpublishPost"
import { TitleBar } from "~/components/TitleBar"
import { api } from "~/trpc/server"

export async function Post({
  slug,
  user,
}: {
  slug: string
  user?: Session["user"]
}) {
  const post = await api.post.get({ slug })

  return (
    <DotBackground>
      <div className="relative flex max-h-screen w-full flex-col space-y-4 overflow-y-auto">
        <TitleBar
          hasBgColor={false}
          title={post.title}
          trailingAccessory={
            <LikeButton id={post.id} user={user} type="post" />
          }
        />
        <div className="flex w-full flex-col gap-2 px-10">
          <div className="flex items-center justify-start gap-4">
            {user?.isAdmin &&
              (post.published ? (
                <UnpublishPost id={post.id} />
              ) : (
                <PublishPost id={post.id} />
              ))}
            {user?.isAdmin && <DeletePost id={post.id} />}
          </div>
          {user?.isAdmin ? (
            <PostEditor post={post} />
          ) : (
            <PostView post={post} />
          )}
          <div className="pt-8">
            <CommentList id={post.id} type="post" user={user} />
            {user && <AddComment id={post.id} type="post" />}
          </div>
        </div>
      </div>
    </DotBackground>
  )
}
