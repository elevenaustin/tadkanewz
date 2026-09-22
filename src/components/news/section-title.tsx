import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function SectionTitle({ children, to }: { children: string; to?: string }) {
  return (
    <div className="mb-5 flex items-center justify-between border-b-2 border-foreground pb-2">
      <h2 className="border-l-4 border-primary pl-3 text-2xl font-black leading-none">{children}</h2>
      {to && <Link to={to} className="flex items-center gap-1 text-xs font-bold text-muted-foreground transition-colors hover:text-primary">ਸਭ ਵੇਖੋ <ArrowRight className="size-3.5" /></Link>}
    </div>
  );
}