import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Shield, SlidersHorizontal, Lock } from "lucide-react";
import { Brand } from "./brand";
import { openCookieSettingsModal } from "./cookie-consent";

const links = [
  {
    title: "TadkaNewz",
    items: [
      ["About (ਸਾਡੇ ਬਾਰੇ)", "/about"],
      ["Contact (ਸੰਪਰਕ)", "/contact"],
      ["Advertise (ਇਸ਼ਤਿਹਾਰ)", "/advertise"],
      ["Write for Us (ਸਾਡੇ ਲਈ ਲਿਖੋ)", "/write"],
    ],
  },
  {
    title: "Categories",
    items: [
      ["ਪੰਜਾਬ", "/category/punjab"],
      ["ਮਨੋਰੰਜਨ", "/category/entertainment"],
      ["ਖੇਡਾਂ", "/category/sports"],
      ["ਟੈਕਨਾਲੋਜੀ", "/category/technology"],
      ["ਬਿਜ਼ਨਸ", "/category/business"],
    ],
  },
  {
    title: "Privacy & Legal",
    items: [
      ["Privacy Policy (ਪਰਦੇਦਾਰੀ ਨੀਤੀ)", "/privacy"],
      ["Terms & Conditions", "/terms"],
      ["Cookie Policy (ਕੂਕੀ ਨੀਤੀ)", "/cookies"],
      ["Admin Portal", "/admin"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t-4 border-primary bg-ink text-primary-foreground">
      <div className="mx-auto grid max-w-site gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Brand inverse />
          <p className="mt-4 max-w-sm text-sm leading-7 text-primary-foreground/65">
            ਪੰਜਾਬੀ ਵਿੱਚ ਖ਼ਬਰਾਂ, ਵਿਚਾਰ, ਕਹਾਣੀਆਂ ਅਤੇ ਜਾਣਕਾਰੀ ਲਈ ਤੁਹਾਡਾ ਆਪਣਾ ਡਿਜ਼ੀਟਲ ਪਲੇਟਫਾਰਮ। ਪਾਰਦਰਸ਼ੀ ਅਤੇ ਭਰੋਸੇਯੋਗ ਪੱਤਰਕਾਰੀ।
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="grid size-9 place-items-center border border-primary-foreground/20 hover:border-primary transition-colors"
            >
              <Facebook className="size-4" />
            </a>
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="grid size-9 place-items-center border border-primary-foreground/20 hover:border-primary transition-colors"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="https://youtube.com"
              aria-label="YouTube"
              className="grid size-9 place-items-center border border-primary-foreground/20 hover:border-primary transition-colors"
            >
              <Youtube className="size-4" />
            </a>
          </div>

          <div className="mt-6">
            <button
              onClick={openCookieSettingsModal}
              className="inline-flex items-center gap-1.5 rounded border border-primary-foreground/25 bg-transparent px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              <SlidersHorizontal className="size-3.5" /> ਕੂਕੀ ਤਰਜੀਹਾਂ (Cookie Settings)
            </button>
          </div>
        </div>

        {links.map((group) => (
          <div key={group.title}>
            <h3 className="mb-4 border-b border-primary-foreground/15 pb-2 font-bold text-sm text-primary-foreground">
              {group.title}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-primary-foreground/65">
              {group.items.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-primary-foreground/10 py-5 px-4 sm:px-6">
        <div className="mx-auto max-w-site flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/50">
          <div>© 2026 TadkaNewz Media. ਸਾਰੇ ਅਧਿਕਾਰ ਰਾਖਵੇਂ ਹਨ।</div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:underline">
              Privacy
            </Link>
            <span>•</span>
            <Link to="/cookies" className="hover:underline">
              Cookies
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:underline">
              Terms
            </Link>
            <span>•</span>
            <Link to="/admin" className="hover:underline flex items-center gap-1">
              <Lock className="size-3" /> Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}