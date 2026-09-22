import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle } from "@/components/news/section-title";
import { StoryCard } from "@/components/news/story-card";
import { NewsSidebar } from "@/components/news/sidebar";
import { categoryMap, stories } from "@/lib/news-data";

export const Route = createFileRoute("/category/$category")({
  head: ({ params }) => { const name = categoryMap[params.category] ?? "ਖ਼ਬਰਾਂ"; return { meta: [{ title: `${name} ਦੀਆਂ ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ — TadkaNewz` }, { name: "description", content: `${name} ਨਾਲ ਜੁੜੀਆਂ ਤਾਜ਼ਾ ਅਤੇ ਭਰੋਸੇਯੋਗ ਪੰਜਾਬੀ ਖ਼ਬਰਾਂ।` }, { property: "og:title", content: `${name} — TadkaNewz` }, { property: "og:description", content: `${name} ਦੀ ਹਰ ਅਹਿਮ ਖ਼ਬਰ ਪੰਜਾਬੀ ਵਿੱਚ।` }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: `/category/${params.category}` }] }; },
  component: CategoryPage,
});
function CategoryPage() { const { category } = Route.useParams(); const name = categoryMap[category] ?? "ਖ਼ਬਰਾਂ"; const ordered = [...stories].sort((a,b) => Number(b.categorySlug === category)-Number(a.categorySlug === category)); return <div className="mx-auto max-w-site px-4 py-8 sm:px-6"><div className="grid gap-10 lg:grid-cols-[minmax(0,2.15fr)_minmax(280px,1fr)]"><section><SectionTitle>{name}</SectionTitle><div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">{ordered.slice(0,8).map(s => <StoryCard key={s.id} story={s} />)}</div></section><NewsSidebar /></div></div>; }