import { Link } from "@tanstack/react-router";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link to="/" className="inline-flex items-baseline font-display text-[2.35rem] font-black leading-none tracking-normal sm:text-[3.2rem]" aria-label="TadkaNewz ਮੁੱਖ ਪੰਨਾ">
      <span className="text-primary">Tadka</span><span className={inverse ? "text-primary-foreground" : "text-foreground"}>Newz</span>
    </Link>
  );
}