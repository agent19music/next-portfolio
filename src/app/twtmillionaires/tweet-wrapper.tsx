import { TweetCard } from "@/components/ui/tweet-card"

export default async function TweetWrapper({ id }: { id: string }) {
  return <TweetCard id={id} />
}
