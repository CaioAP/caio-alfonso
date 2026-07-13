import { getProfile } from '../../content/queries';
import { renderOgImage } from '../../lib/og';

export async function GET() {
  const profile = await getProfile();
  const png = await renderOgImage(profile.headline, `${profile.name} | Frontend Engineer`);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
}
