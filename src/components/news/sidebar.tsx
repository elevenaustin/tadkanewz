import { stories } from "@/lib/news-data";
import { StoryCard } from "./story-card";
import { SectionTitle } from "./section-title";
import { AdSlot } from "./ad-slot";

export function NewsSidebar() {
  return <aside className="space-y-8 lg:border-l lg:border-border lg:pl-6">
    <section><SectionTitle>ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ</SectionTitle>{stories.slice(1, 7).map((story) => <StoryCard key={story.id} story={story} compact />)}</section>
    <AdSlot />
    <section><SectionTitle>🔥 ਟ੍ਰੈਂਡਿੰਗ</SectionTitle><div>{stories.slice(2, 7).map((story, index) => <article key={story.id} className="grid grid-cols-[42px_76px_minmax(0,1fr)] items-center gap-3 border-b border-border py-3"><span className="text-2xl font-black text-border">0{index + 1}</span><img src={story.image} alt="" loading="lazy" width={1280} height={800} className="h-14 w-[76px] rounded-sm object-cover" /><a href={`/${story.categorySlug}/${story.slug}`} className="line-clamp-2 text-sm font-bold leading-[1.4] hover:text-primary">{story.title}</a></article>)}</div></section>
    <AdSlot format="300 × 600" />
  </aside>;
}