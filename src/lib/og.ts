import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

const font = fs.readFileSync(path.join(process.cwd(), 'public/fonts/ZenKakuGothicNew-Regular.ttf'));

/** Renders the shared OG card (1200×630, washi palette, seal mark) to PNG. */
type SatoriElement = Parameters<typeof satori>[0];

export async function renderOgImage(title: string, kicker = 'caio.dev'): Promise<Buffer> {
  const element = {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        background: '#f5f3ed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '60px',
        fontFamily: 'ZenKakuGothicNew',
        position: 'relative',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: '60px',
              left: '60px',
              width: '72px',
              height: '72px',
              background: '#c8553a',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fdfdf9',
              fontSize: '42px',
              fontWeight: 700,
            },
            children: 'カ',
          },
        },
        {
          type: 'p',
          props: {
            style: { fontSize: 18, color: '#9b9389', marginBottom: 16, letterSpacing: 2 },
            children: kicker,
          },
        },
        {
          type: 'h1',
          props: {
            style: {
              fontSize: 54,
              color: '#2b2620',
              lineHeight: 1.25,
              margin: 0,
              maxWidth: '1000px',
            },
            children: title,
          },
        },
      ],
    },
  };
  const svg = await satori(element as unknown as SatoriElement, {
    width: 1200,
    height: 630,
    fonts: [{ name: 'ZenKakuGothicNew', data: font, weight: 400, style: 'normal' }],
  });
  return new Resvg(svg).render().asPng();
}
