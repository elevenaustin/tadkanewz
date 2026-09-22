export function AdSlot({ format = "300 × 250" }: { format?: string }) {
  return <aside aria-label="Advertisement" className="grid min-h-36 place-items-center border border-border bg-muted/40 px-4 text-center"><div><p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">ADVERTISEMENT</p><p className="mt-1 text-xs text-muted-foreground/70">{format}</p></div></aside>;
}