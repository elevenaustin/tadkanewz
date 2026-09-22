import singerImage from "@/assets/punjabi-singer.jpg";
import farmingImage from "@/assets/punjab-farming.jpg";
import sportsImage from "@/assets/punjab-sports.jpg";
import techImage from "@/assets/punjab-tech.jpg";
import encounterImage from "@/assets/gulab-sidhu-encounter.jpg";

export type Story = {
  id: number;
  category: string;
  categorySlug: string;
  slug: string;
  title: string;
  summary: string;
  image: string;
  time: string;
  date: string;
  author: string;
  readTime: string;
};

export const stories: Story[] = [
  { id: 0, category: "ਮਨੋਰੰਜਨ", categorySlug: "entertainment", slug: "gulab-sidhu-house-firing-encounter", title: "ਵੱਡੀ ਖ਼ਬਰ : ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਘਰ 'ਤੇ ਫਾਇਰਿੰਗ ਕਰਨ ਵਾਲੇ ਸ਼ੂਟਰਾਂ ਦਾ ਐਨਕਾਊਂਟਰ", summary: "ਬਰਨਾਲਾ ਪੁਲਸ ਨੇ ਪੰਜਾਬੀ ਗਾਇਕ ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਘਰ 'ਤੇ ਹੋਈ ਫਾਇਰਿੰਗ ਦੀ ਘਟਨਾ ਵਿੱਚ ਐਨਕਾਊਂਟਰ ਤੋਂ ਬਾਅਦ ਮੁੱਖ ਸ਼ੂਟਰਾਂ ਸਮੇਤ 6 ਮੁਲਜ਼ਮਾਂ ਨੂੰ ਹਥਿਆਰਾਂ ਸਮੇਤ ਕਾਬੂ ਕੀਤਾ।", image: encounterImage, time: "12:44 PM", date: "22 ਸਤੰਬਰ 2026", author: "Edited By Cherry", readTime: "3 ਮਿੰਟ" },
  { id: 1, category: "ਮਨੋਰੰਜਨ", categorySlug: "entertainment", slug: "gulab-sidhu-new-song", title: "ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਨਵੇਂ ਗੀਤ ਨੂੰ ਲੈ ਕੇ ਪ੍ਰਸ਼ੰਸਕਾਂ ਵਿੱਚ ਛਾਈ ਖੁਸ਼ੀ, ਜਾਣੋ ਪੂਰੀ ਖ਼ਬਰ", summary: "ਪੰਜਾਬੀ ਸੰਗੀਤ ਜਗਤ ਵਿੱਚ ਨਵੇਂ ਗੀਤ ਦੀ ਚਰਚਾ ਤੇਜ਼, ਰਿਲੀਜ਼ ਹੁੰਦਿਆਂ ਹੀ ਮਿਲਿਆ ਦਰਸ਼ਕਾਂ ਦਾ ਭਰਵਾਂ ਹੁੰਗਾਰਾ।", image: singerImage, time: "09:17 PM", date: "22 ਸਤੰਬਰ 2026", author: "TadkaNewz Desk", readTime: "4 ਮਿੰਟ" },
  { id: 2, category: "ਪੰਜਾਬ", categorySlug: "punjab", slug: "today-big-update", title: "ਪੰਜਾਬ ਨਾਲ ਜੁੜੀ ਅੱਜ ਦੀ ਸਭ ਤੋਂ ਵੱਡੀ ਖ਼ਬਰ, ਲੋਕਾਂ ਲਈ ਹੋਇਆ ਅਹਿਮ ਐਲਾਨ", summary: "ਸੂਬਾ ਸਰਕਾਰ ਨੇ ਨਵੀਂ ਲੋਕ ਭਲਾਈ ਯੋਜਨਾ ਬਾਰੇ ਵਿਸਥਾਰਤ ਜਾਣਕਾਰੀ ਸਾਂਝੀ ਕੀਤੀ ਹੈ।", image: farmingImage, time: "08:54 PM", date: "22 ਸਤੰਬਰ 2026", author: "ਹਰਜੀਤ ਕੌਰ", readTime: "5 ਮਿੰਟ" },
  { id: 3, category: "ਖੇਡਾਂ", categorySlug: "sports", slug: "punjab-hockey-victory", title: "ਪੰਜਾਬ ਦੇ ਨੌਜਵਾਨ ਖਿਡਾਰੀਆਂ ਨੇ ਹਾਕੀ ਮੈਦਾਨ ਵਿੱਚ ਰਚਿਆ ਨਵਾਂ ਇਤਿਹਾਸ", summary: "ਰੋਮਾਂਚਕ ਮੁਕਾਬਲੇ ਵਿੱਚ ਸ਼ਾਨਦਾਰ ਜਿੱਤ ਨਾਲ ਟੀਮ ਨੇ ਕੌਮੀ ਚੈਂਪੀਅਨਸ਼ਿਪ ਦਾ ਖ਼ਿਤਾਬ ਆਪਣੇ ਨਾਂ ਕੀਤਾ।", image: sportsImage, time: "08:31 PM", date: "22 ਸਤੰਬਰ 2026", author: "ਖੇਡ ਡੈਸਕ", readTime: "3 ਮਿੰਟ" },
  { id: 4, category: "ਟੈਕਨਾਲੋਜੀ", categorySlug: "technology", slug: "punjab-startups-ai", title: "ਪੰਜਾਬ ਦੇ ਨੌਜਵਾਨ ਸਟਾਰਟਅੱਪ ਬਦਲ ਰਹੇ ਨੇ ਤਕਨਾਲੋਜੀ ਦੀ ਦੁਨੀਆ", summary: "ਚੰਡੀਗੜ੍ਹ ਅਤੇ ਮੋਹਾਲੀ ਦੇ ਨਵੇਂ ਉੱਦਮੀ ਏਆਈ ਰਾਹੀਂ ਖੇਤੀ ਅਤੇ ਸਿੱਖਿਆ ਲਈ ਹੱਲ ਤਿਆਰ ਕਰ ਰਹੇ ਹਨ।", image: techImage, time: "07:48 PM", date: "22 ਸਤੰਬਰ 2026", author: "ਨਵਦੀਪ ਸਿੰਘ", readTime: "6 ਮਿੰਟ" },
  { id: 5, category: "ਖੇਤੀਬਾੜੀ", categorySlug: "agriculture", slug: "weather-crop-advisory", title: "ਮੌਸਮ ਵਿਭਾਗ ਵੱਲੋਂ ਕਿਸਾਨਾਂ ਲਈ ਨਵੀਂ ਸਲਾਹ, ਅਗਲੇ ਤਿੰਨ ਦਿਨ ਅਹਿਮ", summary: "ਖੇਤੀ ਮਾਹਿਰਾਂ ਨੇ ਫ਼ਸਲਾਂ ਦੀ ਸੰਭਾਲ ਅਤੇ ਸਿੰਚਾਈ ਨੂੰ ਲੈ ਕੇ ਜ਼ਰੂਰੀ ਸੁਝਾਅ ਦਿੱਤੇ।", image: farmingImage, time: "07:26 PM", date: "22 ਸਤੰਬਰ 2026", author: "ਖੇਤੀ ਡੈਸਕ", readTime: "4 ਮਿੰਟ" },
  { id: 6, category: "ਬਿਜ਼ਨਸ", categorySlug: "business", slug: "small-business-growth", title: "ਛੋਟੇ ਕਾਰੋਬਾਰਾਂ ਲਈ ਨਵੀਂ ਯੋਜਨਾ, ਨੌਜਵਾਨਾਂ ਨੂੰ ਮਿਲੇਗਾ ਵੱਡਾ ਮੌਕਾ", summary: "ਨਵੀਂ ਨੀਤੀ ਨਾਲ ਸੂਬੇ ਵਿੱਚ ਰੁਜ਼ਗਾਰ ਅਤੇ ਡਿਜ਼ੀਟਲ ਕਾਰੋਬਾਰ ਨੂੰ ਹੁਲਾਰਾ ਮਿਲਣ ਦੀ ਉਮੀਦ ਹੈ।", image: techImage, time: "06:55 PM", date: "22 ਸਤੰਬਰ 2026", author: "ਬਿਜ਼ਨਸ ਡੈਸਕ", readTime: "5 ਮਿੰਟ" },
  { id: 7, category: "ਲਾਈਫਸਟਾਈਲ", categorySlug: "lifestyle", slug: "healthy-punjabi-kitchen", title: "ਪੰਜਾਬੀ ਰਸੋਈ ਦੇ ਇਹ ਸੌਖੇ ਬਦਲਾਅ ਸਿਹਤ ਨੂੰ ਰੱਖਣਗੇ ਤੰਦਰੁਸਤ", summary: "ਮਾਹਿਰਾਂ ਮੁਤਾਬਕ ਰਵਾਇਤੀ ਖਾਣੇ ਨੂੰ ਸੰਤੁਲਿਤ ਬਣਾਉਣ ਲਈ ਛੋਟੀਆਂ ਆਦਤਾਂ ਹੀ ਕਾਫ਼ੀ ਹਨ।", image: farmingImage, time: "06:19 PM", date: "22 ਸਤੰਬਰ 2026", author: "ਜੀਵਨ ਸ਼ੈਲੀ ਡੈਸਕ", readTime: "4 ਮਿੰਟ" },
  { id: 8, category: "ਵਾਇਰਲ", categorySlug: "viral", slug: "bhangra-video-viral", title: "ਪਿੰਡ ਦੇ ਮੇਲੇ ਦੀ ਭੰਗੜਾ ਵੀਡੀਓ ਨੇ ਜਿੱਤਿਆ ਇੰਟਰਨੈੱਟ ਦਾ ਦਿਲ", summary: "ਨੌਜਵਾਨਾਂ ਦੀ ਜੋਸ਼ੀਲੀ ਪੇਸ਼ਕਾਰੀ ਕੁਝ ਹੀ ਘੰਟਿਆਂ ਵਿੱਚ ਲੱਖਾਂ ਲੋਕਾਂ ਤੱਕ ਪਹੁੰਚੀ।", image: singerImage, time: "05:43 PM", date: "22 ਸਤੰਬਰ 2026", author: "ਵਾਇਰਲ ਡੈਸਕ", readTime: "2 ਮਿੰਟ" },
  { id: 9, category: "ਸਿੱਖਿਆ", categorySlug: "education", slug: "students-scholarship", title: "ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਸਕਾਲਰਸ਼ਿਪ ਦਾ ਐਲਾਨ, ਇੰਝ ਕਰੋ ਅਪਲਾਈ", summary: "ਯੋਗ ਵਿਦਿਆਰਥੀ ਆਨਲਾਈਨ ਅਰਜ਼ੀ ਦੇ ਸਕਣਗੇ, ਵਿਭਾਗ ਨੇ ਪੂਰਾ ਸ਼ਡਿਊਲ ਜਾਰੀ ਕੀਤਾ।", image: techImage, time: "05:02 PM", date: "22 ਸਤੰਬਰ 2026", author: "ਸਿੱਖਿਆ ਡੈਸਕ", readTime: "3 ਮਿੰਟ" },
  { id: 10, category: "ਦੇਸ਼", categorySlug: "india", slug: "railway-festival-special", title: "ਤਿਉਹਾਰੀ ਸੀਜ਼ਨ ਲਈ ਚੱਲਣਗੀਆਂ ਵਿਸ਼ੇਸ਼ ਰੇਲਗੱਡੀਆਂ, ਵੇਖੋ ਪੂਰੀ ਸੂਚੀ", summary: "ਰੇਲਵੇ ਨੇ ਪੰਜਾਬ ਤੋਂ ਚੱਲਣ ਵਾਲੀਆਂ ਕਈ ਵਿਸ਼ੇਸ਼ ਗੱਡੀਆਂ ਦੇ ਸਮੇਂ ਦਾ ਐਲਾਨ ਕੀਤਾ।", image: techImage, time: "04:37 PM", date: "22 ਸਤੰਬਰ 2026", author: "ਨੈਸ਼ਨਲ ਡੈਸਕ", readTime: "3 ਮਿੰਟ" },
  { id: 11, category: "ਸਿਹਤ", categorySlug: "health", slug: "seasonal-health-advice", title: "ਬਦਲਦੇ ਮੌਸਮ ਵਿੱਚ ਇਨ੍ਹਾਂ ਗੱਲਾਂ ਦਾ ਰੱਖੋ ਖ਼ਾਸ ਧਿਆਨ", summary: "ਡਾਕਟਰਾਂ ਨੇ ਬੱਚਿਆਂ ਅਤੇ ਬਜ਼ੁਰਗਾਂ ਦੀ ਸਿਹਤ ਲਈ ਰੋਜ਼ਾਨਾ ਸਾਵਧਾਨੀਆਂ ਸਾਂਝੀਆਂ ਕੀਤੀਆਂ।", image: farmingImage, time: "03:58 PM", date: "22 ਸਤੰਬਰ 2026", author: "ਸਿਹਤ ਡੈਸਕ", readTime: "4 ਮਿੰਟ" },
  { id: 12, category: "ਵਿਚਾਰ", categorySlug: "opinion", slug: "new-punjab-new-thinking", title: "ਨਵਾਂ ਪੰਜਾਬ, ਨਵੀਂ ਸੋਚ: ਨੌਜਵਾਨ ਕਿਵੇਂ ਲਿਖ ਰਹੇ ਨੇ ਬਦਲਾਅ ਦੀ ਕਹਾਣੀ", summary: "ਪਿੰਡ ਤੋਂ ਸ਼ਹਿਰ ਤੱਕ ਨਵੀਂ ਪੀੜ੍ਹੀ ਰੁਜ਼ਗਾਰ, ਸਿੱਖਿਆ ਅਤੇ ਸਭਿਆਚਾਰ ਨੂੰ ਨਵੀਂ ਦਿਸ਼ਾ ਦੇ ਰਹੀ ਹੈ।", image: sportsImage, time: "03:21 PM", date: "22 ਸਤੰਬਰ 2026", author: "ਅਮਨਦੀਪ ਕੌਰ", readTime: "7 ਮਿੰਟ" },
];

export const categoryMap: Record<string, string> = {
  punjab: "ਪੰਜਾਬ", india: "ਦੇਸ਼", world: "ਦੁਨੀਆ", entertainment: "ਮਨੋਰੰਜਨ", sports: "ਖੇਡਾਂ", business: "ਬਿਜ਼ਨਸ", technology: "ਟੈਕਨਾਲੋਜੀ", lifestyle: "ਲਾਈਫਸਟਾਈਲ", health: "ਸਿਹਤ", education: "ਸਿੱਖਿਆ", agriculture: "ਖੇਤੀਬਾੜੀ", viral: "ਵਾਇਰਲ", opinion: "ਵਿਚਾਰ",
};

export const categories = Object.entries(categoryMap).map(([slug, name]) => ({ slug, name }));

export function getStory(category: string, slug: string) {
  return stories.find((story) => story.categorySlug === category && story.slug === slug) ?? stories[0];
}