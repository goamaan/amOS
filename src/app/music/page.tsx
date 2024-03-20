import { ListDetailView } from "~/app/layout"
import { Music } from "~/components/Music/Music"

export default async function MusicPage() {
  return <ListDetailView list={null} hasDetail detail={<Music />} />
}
