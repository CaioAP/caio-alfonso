import rss from '@astrojs/rss';
import { getPosts } from '../content/queries';

export async function GET(context: { site: URL }) {
  const posts = await getPosts();
  return rss({
    title: 'Caio — Frontend Blog',
    description: 'Daily frontend writing.',
    site: context.site,
    items: posts.map((p) => ({
      title: p.title,
      pubDate: new Date(p.publishedAt),
      description: p.excerpt,
      link: `/blog/${p.slug.current}`,
    })),
  });
}
