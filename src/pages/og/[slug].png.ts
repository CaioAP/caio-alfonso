import { getPosts } from '../../content/queries';
import type { PostListItem } from '../../content/types';
import { renderOgImage } from '../../lib/og';

export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((p) => ({ params: { slug: p.slug.current }, props: { post: p } }));
}

export async function GET({ props }: { props: { post: PostListItem } }) {
  const png = await renderOgImage(props.post.title);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
}
