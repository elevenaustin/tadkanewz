import { Link } from "@tanstack/react-router";
import { Clock3 } from "lucide-react";
import type { Story } from "@/lib/news-data";
import { cn } from "@/lib/utils";

export function StoryCard({ story, compact = false, priority = false }: { story: Story; compact?: boolean; priority?: boolean }) {
  if (compact) return (
    <article className="group grid grid-cols-[96px_minmax(0,1fr)] gap-3 border-b border-border py-3 last:border-b-0">
      <Link to="/$category/$slug" params={{ category: story.categorySlug, slug: story.slug }} className="overflow-hidden rounded-sm">
        <img src={story.image} alt="" loading="lazy" width={1280} height={800} className="h-18 w-24 object-cover transition-transform duration-300 group-hover:scale-105" />
      </Link>
      <div className="min-w-0">
        <p className="mb-1 text-[11px] font-bold text-primary">{story.time}</p>
        <h3 className="line-clamp-2 text-sm font-bold leading-[1.45] text-foreground group-hover:text-primary">
          <Link to="/$category/$slug" params={{ category: story.categorySlug, slug: story.slug }}>{story.title}</Link>
        </h3>
      </div>
    </article>
  );

  return (
    <article className="group">
      <Link to="/$category/$slug" params={{ category: story.categorySlug, slug: story.slug }} className="block overflow-hidden rounded-sm bg-muted">
        <img src={story.image} alt={story.title} loading={priority ? "eager" : "lazy"} width={1280} height={800} className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]" />
      </Link>
      <div className="pt-3">
        <p className="mb-1.5 text-xs font-bold text-primary">{story.category}</p>
        <h3 className={cn("font-bold leading-[1.4] text-foreground group-hover:text-primary", priority ? "text-xl sm:text-2xl" : "text-base")}>
          <Link to="/$category/$slug" params={{ category: story.categorySlug, slug: story.slug }}>{story.title}</Link>
        </h3>
        {!compact && <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3" /> {story.date} · {story.readTime}</p>}
      </div>
    </article>
  );
}