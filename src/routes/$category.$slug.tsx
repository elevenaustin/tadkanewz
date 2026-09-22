import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Check, Copy, Facebook, Heart, Play, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NewsSidebar } from "@/components/news/sidebar";
import { SectionTitle } from "@/components/news/section-title";
import { StoryCard } from "@/components/news/story-card";
import { getStory, stories } from "@/lib/news-data";

export const Route = createFileRoute("/$category/$slug")({
  head: ({ params }) => { const story = getStory(params.category, params.slug); return { meta: [{ title: `${story.title} — TadkaNewz` }, { name: "description", content: story.summary }, { property: "og:title", content: story.title }, { property: "og:description", content: story.summary }, { property: "og:type", content: "article" }, { property: "og:url", content: `/${params.category}/${params.slug}` }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: `/${params.category}/${params.slug}` }], scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "NewsArticle", headline: story.title, datePublished: "2026-09-22T15:53:00+05:30", dateModified: "2026-09-22T21:17:00+05:30", author: { "@type": "Organization", name: story.author }, publisher: { "@type": "Organization", name: "TadkaNewz" }, articleSection: story.category }) }] }; },
  component: ArticlePage,
});

function ArticlePage() {
  const { category, slug } = Route.useParams();
  const story = getStory(category, slug);
  const [liked, setLiked] = useState(false), [saved, setSaved] = useState(false), [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard?.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
  return <div className="mx-auto max-w-site px-4 py-7 sm:px-6">
    <nav className="mb-6 text-xs text-muted-foreground"><Link to="/">ਮੁੱਖ ਪੰਨਾ</Link> &nbsp;/&nbsp; <Link to="/category/$category" params={{ category }}>{story.category}</Link> &nbsp;/&nbsp; ਖ਼ਬਰ</nav>
    <div className="grid gap-10 lg:grid-cols-[minmax(0,2.15fr)_minmax(280px,1fr)]">
      <article className="min-w-0">
        <span className="inline-block bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">{story.category}</span>
        <h1 className="mt-4 text-3xl font-black leading-[1.35] text-foreground sm:text-4xl lg:text-[2.65rem]">{story.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{story.summary}</p>
        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-y border-border py-4"><div className="min-w-0 text-sm"><Link to="/author/harjeet-kaur" className="font-bold text-primary">By {story.author}</Link><p className="mt-1 text-xs text-muted-foreground">{story.date} &nbsp; · &nbsp; Updated: 9:17 PM</p></div><div className="flex shrink-0 gap-1"><Button size="icon" variant={liked ? "default" : "outline"} onClick={() => setLiked(!liked)} aria-label="ਪਸੰਦ ਕਰੋ"><Heart className={liked ? "fill-current" : ""} /></Button><Button size="icon" variant={saved ? "default" : "outline"} onClick={() => setSaved(!saved)} aria-label="ਬੁੱਕਮਾਰਕ ਕਰੋ"><Bookmark className={saved ? "fill-current" : ""} /></Button><Button size="icon" variant="outline" onClick={copy} aria-label="ਲਿੰਕ ਕਾਪੀ ਕਰੋ">{copied ? <Check /> : <Copy />}</Button></div></div>
        <div className="my-5 flex flex-wrap items-center gap-2"><span className="mr-1 text-xs font-bold text-muted-foreground">SHARE</span><Button size="sm" variant="outline"><Facebook /> Facebook</Button><Button size="sm" variant="outline"><Share2 /> WhatsApp</Button><Button size="sm" variant="outline">𝕏</Button></div>
        <figure><img src={story.image} alt={story.title} width={1280} height={800} className="aspect-[16/10] w-full rounded-sm object-cover" /><figcaption className="border-b border-border py-2 text-xs leading-5 text-muted-foreground">ਪੰਜਾਬੀ ਸੱਭਿਆਚਾਰ ਅਤੇ ਸੰਗੀਤ ਨਾਲ ਜੁੜੀ ਤਾਜ਼ਾ ਤਸਵੀਰ। ਫੋਟੋ: TadkaNewz</figcaption></figure>
        <div className="article-copy mx-auto max-w-[760px] py-8 text-[18px] leading-[1.9] text-foreground sm:text-[19px]">
          <p><strong>ਚੰਡੀਗੜ੍ਹ:</strong> ਪੰਜਾਬੀ ਸੰਗੀਤ ਅਤੇ ਮਨੋਰੰਜਨ ਜਗਤ ਵਿੱਚ ਅੱਜ ਇੱਕ ਵੱਡੀ ਹਲਚਲ ਦੇਖਣ ਨੂੰ ਮਿਲੀ ਹੈ। ਨਵੀਂ ਪੇਸ਼ਕਸ਼ ਨੇ ਰਿਲੀਜ਼ ਹੋਣ ਦੇ ਕੁਝ ਹੀ ਸਮੇਂ ਵਿੱਚ ਸਰੋਤਿਆਂ ਦਾ ਧਿਆਨ ਆਪਣੇ ਵੱਲ ਖਿੱਚ ਲਿਆ। ਸੋਸ਼ਲ ਮੀਡੀਆ ਉੱਤੇ ਪ੍ਰਸ਼ੰਸਕ ਲਗਾਤਾਰ ਆਪਣੀ ਪ੍ਰਤੀਕਿਰਿਆ ਸਾਂਝੀ ਕਰ ਰਹੇ ਹਨ।</p>
          <p>ਕਲਾਕਾਰ ਦੀ ਟੀਮ ਮੁਤਾਬਕ ਇਸ ਪ੍ਰੋਜੈਕਟ ਉੱਤੇ ਕਈ ਮਹੀਨਿਆਂ ਤੋਂ ਕੰਮ ਚੱਲ ਰਿਹਾ ਸੀ। ਸੰਗੀਤ, ਬੋਲ ਅਤੇ ਵੀਡੀਓ ਵਿੱਚ ਪੰਜਾਬੀ ਵਿਰਸੇ ਨੂੰ ਆਧੁਨਿਕ ਅੰਦਾਜ਼ ਨਾਲ ਪੇਸ਼ ਕਰਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕੀਤੀ ਗਈ ਹੈ।</p>
          <h2>ਪ੍ਰਸ਼ੰਸਕਾਂ ਵੱਲੋਂ ਮਿਲਿਆ ਭਰਵਾਂ ਹੁੰਗਾਰਾ</h2><p>ਗੀਤ ਦੇ ਰਿਲੀਜ਼ ਹੁੰਦਿਆਂ ਹੀ ਵੱਖ-ਵੱਖ ਡਿਜ਼ੀਟਲ ਮੰਚਾਂ ਉੱਤੇ ਟਿੱਪਣੀਆਂ ਦਾ ਸਿਲਸਿਲਾ ਸ਼ੁਰੂ ਹੋ ਗਿਆ। ਨੌਜਵਾਨਾਂ ਦੇ ਨਾਲ ਪਰਿਵਾਰਕ ਦਰਸ਼ਕਾਂ ਨੇ ਵੀ ਇਸ ਦੀ ਸਾਦਗੀ ਅਤੇ ਪੰਜਾਬੀਅਤ ਦੀ ਤਾਰੀਫ਼ ਕੀਤੀ ਹੈ।</p>
          <div className="my-8 overflow-hidden rounded-sm bg-ink"><div className="relative aspect-video"><img src={story.image} alt="ਵੀਡੀਓ ਝਲਕ" loading="lazy" width={1280} height={800} className="h-full w-full object-cover opacity-45" /><span className="absolute left-4 top-4 bg-primary px-2 py-1 text-xs font-black text-primary-foreground">VIDEO</span><button onClick={() => alert("ਵੀਡੀਓ ਜਲਦ ਉਪਲਬਧ ਹੋਵੇਗੀ")} className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105" aria-label="ਵੀਡੀਓ ਚਲਾਓ"><Play className="ml-1 size-7 fill-current" /></button></div><p className="p-4 text-base font-bold text-primary-foreground">ਵੇਖੋ: ਨਵੇਂ ਗੀਤ ਦੇ ਰਿਲੀਜ਼ ਮੌਕੇ ਦੀ ਖ਼ਾਸ ਗੱਲਬਾਤ</p></div>
          <blockquote>“ਸਾਡੀ ਕੋਸ਼ਿਸ਼ ਹਮੇਸ਼ਾ ਇਹ ਰਹੀ ਹੈ ਕਿ ਪੰਜਾਬੀ ਬੋਲੀ ਅਤੇ ਸੱਭਿਆਚਾਰ ਦੀ ਖੁਸ਼ਬੂ ਦੁਨੀਆ ਦੇ ਹਰ ਕੋਨੇ ਤੱਕ ਪਹੁੰਚੇ।”</blockquote>
          <h2>ਨਵੀਂ ਪੀੜ੍ਹੀ ਨਾਲ ਖ਼ਾਸ ਜੁੜਾਅ</h2><p>ਮਾਹਿਰਾਂ ਦਾ ਮੰਨਣਾ ਹੈ ਕਿ ਪੰਜਾਬੀ ਸੰਗੀਤ ਹੁਣ ਵਿਸ਼ਵ ਪੱਧਰ ਉੱਤੇ ਆਪਣੀ ਵੱਖਰੀ ਪਛਾਣ ਬਣਾ ਚੁੱਕਾ ਹੈ। ਨਵੀਂ ਪੀੜ੍ਹੀ ਰਵਾਇਤੀ ਧੁਨਾਂ ਦੇ ਨਾਲ ਨਵੇਂ ਪ੍ਰਯੋਗਾਂ ਨੂੰ ਵੀ ਖੁੱਲ੍ਹੇ ਦਿਲ ਨਾਲ ਸਵੀਕਾਰ ਕਰ ਰਹੀ ਹੈ।</p><p>ਆਉਣ ਵਾਲੇ ਦਿਨਾਂ ਵਿੱਚ ਕਲਾਕਾਰ ਵੱਲੋਂ ਇਸ ਗੀਤ ਨਾਲ ਜੁੜੀਆਂ ਹੋਰ ਪੇਸ਼ਕਾਰੀਆਂ ਅਤੇ ਲਾਈਵ ਸਮਾਗਮਾਂ ਦਾ ਐਲਾਨ ਕੀਤੇ ਜਾਣ ਦੀ ਵੀ ਉਮੀਦ ਹੈ।</p>
          <div className="my-7 border-l-4 border-primary bg-muted p-5 text-base"><strong>ਇਹ ਵੀ ਜਾਣੋ:</strong><ul className="mt-2 list-disc space-y-2 pl-5"><li><Link to="/category/$category" params={{ category: "entertainment" }} className="font-semibold hover:text-primary">ਪੰਜਾਬੀ ਮਨੋਰੰਜਨ ਜਗਤ ਦੀਆਂ ਹੋਰ ਖ਼ਬਰਾਂ</Link></li><li><Link to="/author/harjeet-kaur" className="font-semibold hover:text-primary">ਲੇਖਕ ਦੀਆਂ ਤਾਜ਼ਾ ਰਿਪੋਰਟਾਂ</Link></li></ul></div>
        </div>
        <section className="mt-6"><SectionTitle>ਇਹ ਵੀ ਪੜ੍ਹੋ</SectionTitle><div className="grid gap-6 sm:grid-cols-2">{stories.slice(2,6).map(s => <StoryCard key={s.id} story={s} />)}</div></section>
      </article>
      <NewsSidebar />
    </div>
    <section className="mt-14"><SectionTitle>ਤਾਜ਼ਾ ਅਤੇ ਦਿਲਚਸਪ</SectionTitle><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><div className="sm:col-span-2"><StoryCard story={stories[7]} priority /></div>{stories.slice(8,12).map(s => <StoryCard key={s.id} story={s} />)}</div></section>
  </div>;
}