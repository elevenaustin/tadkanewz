import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/news/section-title";
import { StoryCard } from "@/components/news/story-card";
import { AdSlot } from "@/components/news/ad-slot";
import { stories } from "@/lib/news-data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "TadkaNewz — ਪੰਜਾਬ ਦੀ ਆਪਣੀ ਡਿਜ਼ੀਟਲ ਆਵਾਜ਼" }, { name: "description", content: "ਪੰਜਾਬੀ ਵਿੱਚ ਅੱਜ ਦੀਆਂ ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ, ਪੰਜਾਬ, ਖੇਡਾਂ, ਮਨੋਰੰਜਨ, ਟੈਕਨਾਲੋਜੀ ਅਤੇ ਵਿਚਾਰ।" }, { property: "og:title", content: "TadkaNewz — ਤਾਜ਼ਾ ਪੰਜਾਬੀ ਖ਼ਬਰਾਂ" }, { property: "og:description", content: "ਪੰਜਾਬ ਦੀ ਆਪਣੀ ਡਿਜ਼ੀਟਲ ਆਵਾਜ਼" }, { property: "og:type", content: "website" }, { property: "og:url", content: "/" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: "/" }] }),
  component: HomePage,
});

function HomePage() {
  const categoryGroups = ["ਪੰਜਾਬ", "ਮਨੋਰੰਜਨ", "ਖੇਡਾਂ", "ਟੈਕਨਾਲੋਜੀ", "ਬਿਜ਼ਨਸ", "ਵਾਇਰਲ", "ਲਾਈਫਸਟਾਈਲ"];
  return <div className="mx-auto max-w-site px-4 py-7 sm:px-6">
    <div className="mb-6 text-[10px] font-semibold text-muted-foreground">HOME &nbsp;/&nbsp; TOP STORIES</div>
    <section className="grid gap-5 border-b border-border pb-8 lg:grid-cols-[1.45fr_1fr]">
      <article className="group relative min-h-[360px] overflow-hidden rounded-sm sm:min-h-[480px]">
        <img
          src={stories[0].image}
          alt={stories[0].title}
          width={1280}
          height={800}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground sm:p-8">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 px-2 py-1 text-xs font-black uppercase text-white shadow">
              BREAKING NEWS
            </span>
            <span className="bg-primary px-2 py-1 text-xs font-bold">
              {stories[0].category}
            </span>
          </div>
          <h1 className="mt-3 max-w-3xl text-2xl font-black leading-[1.35] sm:text-3xl lg:text-4xl hover:text-primary-foreground/90">
            <Link to="/newslink">{stories[0].title}</Link>
          </h1>
          <p className="mt-3 hidden max-w-2xl text-sm leading-6 text-primary-foreground/85 sm:block line-clamp-2">
            {stories[0].summary}
          </p>
        </div>
      </article>
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {stories.slice(1, 5).map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </section>
    <div className="py-7"><AdSlot format="728 × 90" /></div>
    <section><SectionTitle to="/category/punjab">ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ</SectionTitle><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{stories.slice(4,8).map(story => <StoryCard key={story.id} story={story} />)}</div></section>
    <section className="my-12 grid items-center gap-8 border-y-4 border-primary bg-ink px-6 py-9 text-primary-foreground sm:px-10 lg:grid-cols-[1fr_auto]"><div><p className="text-sm font-bold text-primary">WRITE FOR TADKANEWZ</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">ਤੁਹਾਡੀ ਕਹਾਣੀ, ਤੁਹਾਡੀ ਆਵਾਜ਼</h2><p className="mt-2 text-primary-foreground/65">ਆਪਣਾ ਪੰਜਾਬੀ ਬਲੌਗ ਜਾਂ ਕਹਾਣੀ TadkaNewz 'ਤੇ ਪਬਲਿਸ਼ ਕਰੋ।</p></div><Button asChild size="lg" className="rounded-sm"><Link to="/write"><PenLine /> Write a Blog</Link></Button></section>
    <div className="space-y-12">{categoryGroups.map((name, index) => { const featured = stories[index % stories.length]; const more = [stories[(index+2)%stories.length], stories[(index+4)%stories.length], stories[(index+6)%stories.length], stories[(index+8)%stories.length]]; return <section key={name}><SectionTitle to={`/category/${featured.categorySlug}`}>{name}</SectionTitle><div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]"><StoryCard story={featured} priority={index === 0}/><div className="grid grid-cols-2 gap-5">{more.map(s => <StoryCard key={s.id} story={s} />)}</div></div></section>; })}</div>
    <div className="mt-10 flex justify-center"><Button variant="outline">ਹੋਰ ਖ਼ਬਰਾਂ ਵੇਖੋ <ArrowRight /></Button></div>
  </div>;
}