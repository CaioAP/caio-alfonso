# Spec: About Page

Long-form bio, skills, CV download, contact. All content from Sanity `profile` singleton.

## File

```
src/pages/about.astro
```

## `src/pages/about.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Prose      from '../components/Prose.astro';
import Seal       from '../components/Seal.astro';
import { PortableText } from 'astro-portabletext';
import { getProfile } from '../content/queries';
import { urlFor } from '../content/imageUrl';

const profile = await getProfile();
const photoSrc = urlFor(profile.photo.asset).width(480).height(480).fit('crop').url();

const schema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name:      profile.name,
  jobTitle:  "Frontend Engineer",
  email:     profile.email,
  url:       Astro.site?.toString(),
  sameAs:    profile.socials.map(s => s.url),
};
---
<BaseLayout
  title={`About — ${profile.name}`}
  description={`Frontend Engineer based in ${profile.location}.`}
>
  <script type="application/ld+json" set:html={JSON.stringify(schema)} slot="head" />

  <article class="band">
    <div class="wrap about-layout">
      <!-- Text column -->
      <div class="about-text">
        <p class="eyebrow">About</p>
        <h1>{profile.name}</h1>
        <p class="about-sub">{profile.headline}</p>

        <Prose>
          <PortableText value={profile.bio} />
        </Prose>

        <!-- Availability badge -->
        {profile.availableForWork && (
          <p class="avail-badge">
            <span class="avail-dot" aria-hidden="true"></span>
            Available for new opportunities
          </p>
        )}

        <!-- Contact -->
        <div class="about-contact">
          <a class="btn btn-fill" href={`mailto:${profile.email}`}>Get in touch</a>
          {profile.cv && (
            <a class="btn" href={profile.cv.asset.url} download>
              Download CV ↓
            </a>
          )}
        </div>

        <!-- Socials -->
        <nav class="about-socials" aria-label="Social links">
          {profile.socials.map(s => (
            <a class="link" href={s.url} target="_blank" rel="noopener">{s.label}</a>
          ))}
        </nav>
      </div>

      <!-- Photo column -->
      <div class="about-photo">
        <img
          src={photoSrc}
          alt={profile.photo.alt}
          width="480"
          height="480"
          loading="eager"
        />
        <div class="photo-seal" aria-hidden="true">
          <Seal size="sm" />
        </div>
      </div>
    </div>
  </article>
</BaseLayout>

<style>
  .about-layout {
    display: grid;
    grid-template-columns: 1fr clamp(200px, 28vw, 320px);
    gap: clamp(40px, 7vw, 80px);
    align-items: start;
    padding-block: clamp(72px, 10vw, 140px);
  }
  .about-text h1 { font-size: clamp(2rem, 1.7rem + 1.3vw, 3rem); margin-top: .4rem; }
  .about-sub { color: var(--ink-muted); font-size: 1.1rem; margin-top: .6rem; }

  .avail-badge {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    font-family: var(--font-mono);
    font-size: .78rem;
    color: var(--shu-strong);
    margin-top: 2rem;
  }
  .avail-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--shu);
    animation: pulse 2s ease infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: .4; }
  }
  @media (prefers-reduced-motion: reduce) { .avail-dot { animation: none; } }

  .about-contact { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 2.4rem; }
  .about-socials { display: flex; gap: 1.4rem; flex-wrap: wrap; margin-top: 1.4rem; font-family: var(--font-mono); font-size: .8rem; }

  .about-photo {
    position: relative;
    border: 1px solid var(--line);
  }
  .about-photo img { width: 100%; height: auto; display: block; }
  .photo-seal { position: absolute; bottom: 14px; right: 14px; }

  @media (max-width: 760px) {
    .about-layout { grid-template-columns: 1fr; }
    .about-photo { max-width: 200px; }
  }
</style>
```

## Skills section (optional)

If skills are added to the `profile` schema as `skills: string[]`, render after the bio:

```astro
<div class="skills-grid">
  {profile.skills?.map(s => <span class="chip">{s}</span>)}
</div>
```

```css
.skills-grid { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.6rem; }
```

## Definition of done

- CV download button only renders if `profile.cv` exists in Sanity.
- Availability dot animation respects `prefers-reduced-motion`.
- Photo has `alt` from Sanity (enforced by Zod `ProfileSchema`).
- Person structured data valid (test at schema.org/validator).
- Page passes axe — email link has accessible text, social links open in new tab with `noopener`.
- Lighthouse ≥ 95, ~0 KB JS (no islands on this page).
