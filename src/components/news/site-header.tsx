import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brand } from "./brand";
import { categories, stories } from "@/lib/news-data";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const submit = (event: React.FormEvent) => { event.preventDefault(); navigate({ to: "/search", search: { q: query } }); setOpen(false); };
  return <>
    <div className="bg-ink text-primary-foreground">
      <div className="mx-auto grid h-8 max-w-site grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-4 text-[11px] sm:px-6">
        <strong className="shrink-0 text-primary">ਅੱਜ ਦੀਆਂ ਮੁੱਖ ਖ਼ਬਰਾਂ</strong>
        <Link to="/newslink" className="truncate text-center text-primary-foreground/90 hover:text-primary transition-colors">
          ਵੱਡੀ ਖ਼ਬਰ : ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਘਰ 'ਤੇ ਫਾਇਰਿੰਗ ਕਰਨ ਵਾਲੇ ਸ਼ੂਟਰਾਂ ਦਾ ਐਨਕਾਊਂਟਰ · ਵਿਸ਼ੇਸ਼ ਰਿਪੋਰਟ
        </Link>
        <span className="hidden shrink-0 sm:block">ਮੰਗਲਵਾਰ, 22 ਸਤੰਬਰ 2026</span>
      </div>
    </div>
    <header className="bg-background">
      <div className="mx-auto grid max-w-site grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-3 px-4 py-5 sm:px-6 lg:grid-cols-[310px_minmax(0,1fr)_44px]">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="ਮੇਨੂ ਖੋਲ੍ਹੋ"><Menu /></Button>
        <div className="text-center lg:text-left"><Brand /><p className="mt-1 hidden text-[10px] font-bold tracking-[0.2em] text-muted-foreground lg:block">ਪੰਜਾਬ ਦੀ ਆਪਣੀ ਡਿਜ਼ੀਟਲ ਆਵਾਜ਼</p></div>
        <div className="hidden grid-cols-3 gap-4 lg:grid">
          {stories.slice(1, 4).map(story => <Link key={story.id} to="/$category/$slug" params={{ category: story.categorySlug, slug: story.slug }} className="grid grid-cols-[68px_minmax(0,1fr)] items-center gap-2 border-l border-border pl-4"><img src={story.image} alt="" loading="lazy" width={1280} height={800} className="h-12 w-[68px] object-cover" /><span className="line-clamp-2 text-xs font-bold leading-[1.45] hover:text-primary">{story.title}</span></Link>)}
        </div>
        <Button asChild variant="ghost" size="icon"><Link to="/search" aria-label="ਖੋਜੋ"><Search /></Link></Button>
      </div>
      <nav className="border-y border-primary bg-primary text-primary-foreground" aria-label="ਮੁੱਖ ਸ਼੍ਰੇਣੀਆਂ">
        <div className="mx-auto flex max-w-site overflow-x-auto px-4 sm:px-6">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "bg-primary-foreground text-primary" }} className="shrink-0 px-3 py-3 text-sm font-bold transition-colors hover:bg-primary-foreground hover:text-primary">ਮੁੱਖ ਖ਼ਬਰਾਂ</Link>
          {categories.map(category => <Link key={category.slug} to="/category/$category" params={{ category: category.slug }} activeProps={{ className: "bg-primary-foreground text-primary" }} className="shrink-0 px-3 py-3 text-sm font-bold transition-colors hover:bg-primary-foreground hover:text-primary">{category.name}</Link>)}
        </div>
      </nav>
      <div className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-site grid-cols-[auto_minmax(0,1fr)] items-center overflow-hidden px-4 sm:px-6"><span className="z-10 -ml-4 bg-red-600 px-4 py-2 text-[11px] font-black text-white">BREAKING NEWS</span><div className="overflow-hidden"><div className="ticker whitespace-nowrap py-2 text-xs font-semibold"><Link to="/newslink" className="text-red-600 dark:text-red-400 font-bold hover:underline">ਵੱਡੀ ਖ਼ਬਰ : ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਘਰ 'ਤੇ ਫਾਇਰਿੰਗ ਕਰਨ ਵਾਲੇ ਸ਼ੂਟਰਾਂ ਦਾ ਐਨਕਾਊਂਟਰ</Link> &nbsp;&nbsp; • &nbsp;&nbsp; ਬਰਨਾਲਾ ਪੁਲਸ ਵੱਲੋਂ 6 ਮੁਲਜ਼ਮ ਅਸਲੇ ਸਮੇਤ ਗ੍ਰਿਫ਼ਤਾਰ &nbsp;&nbsp; • &nbsp;&nbsp; ਪੰਜਾਬ ਨਾਲ ਜੁੜੀ ਵੱਡੀ ਖ਼ਬਰ &nbsp;&nbsp; • &nbsp;&nbsp; ਨੌਜਵਾਨਾਂ ਲਈ ਨਵੀਂ ਯੋਜਨਾ ਦਾ ਐਲਾਨ</div></div></div>
      </div>
    </header>
    {open && <div className="fixed inset-0 z-50 bg-foreground/40 lg:hidden" onClick={() => setOpen(false)}><div className="h-full w-[86%] max-w-sm bg-background p-5 shadow-xl" onClick={e => e.stopPropagation()}><div className="flex items-center justify-between"><Brand /><Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="ਮੇਨੂ ਬੰਦ ਕਰੋ"><X /></Button></div><form onSubmit={submit} className="mt-7 flex border border-input"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="ਖ਼ਬਰਾਂ ਖੋਜੋ..." className="min-w-0 flex-1 bg-background px-3 text-sm outline-none" /><Button type="submit" size="icon" className="rounded-none"><Search /></Button></form><nav className="mt-6 grid grid-cols-2 gap-px bg-border border border-border"><Link to="/" onClick={() => setOpen(false)} className="bg-background p-3 font-bold">ਮੁੱਖ ਖ਼ਬਰਾਂ</Link>{categories.map(category => <Link key={category.slug} to="/category/$category" params={{ category: category.slug }} onClick={() => setOpen(false)} className="bg-background p-3 font-bold hover:text-primary">{category.name}</Link>)}</nav><Button asChild className="mt-6 w-full"><Link to="/write" onClick={() => setOpen(false)}>Write a Blog</Link></Button></div></div>}
  </>;
}