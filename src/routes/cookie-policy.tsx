import { createFileRoute } from "@tanstack/react-router";
import { CookiePolicyPage } from "./cookies";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — TadkaNewz" },
      { name: "description", content: "TadkaNewz Cookie Policy and Settings" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: CookiePolicyPage,
});
