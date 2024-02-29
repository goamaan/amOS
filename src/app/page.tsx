import { unstable_noStore as noStore } from "next/cache"
import Link from "next/link"

import { CreatePost } from "~/app/_components/create-post"
import { getServerAuthSession } from "~/server/auth"

export default async function Home() {
  noStore()
  const session = await getServerAuthSession()

  return <div></div>
}

// async function CrudShowcase() {
//   const session = await getServerAuthSession()
//   if (!session?.user) return null

//   return (
//     <div className="w-full max-w-xs">
//       <CreatePost />
//     </div>
//   )
// }
