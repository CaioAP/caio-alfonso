# Spec: Work & Experience

Experience timeline and project case studies. All data from Sanity, rendered at build time.

## Files

```
src/pages/work/
  index.astro         # timeline + project grid
  [slug].astro        # project case study

src/features/work/
  TimelineRow.astro
  ProjectCard.astro
  ProjectGrid.astro
```

## `src/pages/work/index.astro`

```astro
---
import BaseLayout    from '../../layouts/BaseLayout.astro';
import TimelineRow   from '../../features/work/TimelineRow.astro';
import ProjectCard   from '../../features/work/ProjectCard.astro';
import { getExperiences, getProjects } from '../../content/queries';

const experiences = await getExperiences();   // ordered by order asc
const projects    = await getProjects();       // all, ordered by order asc
---
<BaseLayout title="Work & Experience — Caio" description="...">
  <!-- Experience timeline -->
  <section class="band">
    <div class="wrap">
      <p class="eyebrow">Experience</p>
      <h1 class="h2lead">A typed timeline — chronology that carries meaning.</h1>
      <div class="tl">
        {experiences.map(e => <TimelineRow experience={e} />)}
      </div>
    </div>
  </section>

  <!-- Projects -->
  <section class="band" style="padding-top:0">
    <div class="wrap">
      <p class="eyebrow">Projects</p>
      <h2 class="h2lead">Selected work.</h2>
      <div class="project-grid">
        {projects.map(p => <ProjectCard project={p} />)}
      </div>
    </div>
  </section>
</BaseLayout>
```

## `src/features/work/TimelineRow.astro`

```astro
---
import type { Experience } from '../../content/types';
interface Props { experience: Experience }
const { experience: e } = Astro.props;
const end = e.end
  ? new Date(e.end).getFullYear().toString()
  : 'Present';
const start = new Date(e.start).getFullYear();
---
<div class="tl-row">
  <div class="tl-date">{start} — {end}</div>
  <div class="tl-body">
    <div class="tl-role">{e.role}</div>
    <div class="tl-co">{e.company}{e.location ? ` · ${e.location}` : ''}</div>
    {e.highlights.length > 0 && (
      <ul class="tl-highlights">
        {e.highlights.map(h => <li>{h}</li>)}
      </ul>
    )}
  </div>
</div>

<style>
  .tl-row {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 1.6rem;
    padding: 1.6rem 0;
    border-bottom: 1px solid var(--line);
  }
  .tl-row:first-child { border-top: 1px solid var(--line); }
  .tl-date { font-family: var(--font-mono); font-size: .78rem; color: var(--ink-faint); padding-top: .35rem; }
  .tl-role { font-family: var(--font-display); font-weight: 700; font-size: 1.2rem; }
  .tl-co   { color: var(--ink-muted); font-size: .88rem; margin-top: .15rem; }
  .tl-highlights {
    margin: .6rem 0 0;
    padding-left: 1.1rem;
    color: var(--ink-muted);
    font-size: .95rem;
  }
  .tl-highlights li + li { margin-top: .3rem; }
  @media (max-width: 560px) { .tl-row { grid-template-columns: 1fr; gap: .3rem; } }
</style>
```

## `src/features/work/ProjectCard.astro`

Used on both the work index and the home page featured section.

```astro
---
import { urlFor } from '../../content/imageUrl';
import type { Project } from '../../content/types';
interface Props { project: Project }
const { project: p } = Astro.props;
const imgSrc = p.cover ? urlFor(p.cover.asset).width(640).height(360).fit('crop').url() : null;
---
<a class="project-card hairline-card" href={`/work/${p.slug.current}`}>
  {imgSrc && <img src={imgSrc} alt={p.cover!.alt} width="640" height="360" loading="lazy" />}
  <div class="card-body">
    <div class="card-stack">
      {p.stack.slice(0, 4).map(s => <span class="chip">{s}</span>)}
    </div>
    <h3>{p.title}</h3>
    <p>{p.summary}</p>
    <span class="go">view case study →</span>
  </div>
</a>

<style>
  .project-card { display: flex; flex-direction: column; text-decoration: none; color: inherit; }
  .project-card img { width: 100%; height: auto; display: block; border-bottom: 1px solid var(--line); }
  .card-body { padding: 1.4rem; flex: 1; display: flex; flex-direction: column; gap: .5rem; }
  .card-stack { display: flex; gap: .4rem; flex-wrap: wrap; }
  .project-card h3 { font-size: 1.2rem; }
  .project-card p  { margin: 0; color: var(--ink-muted); font-size: .92rem; }
  .go { margin-top: auto; font-family: var(--font-mono); font-size: .72rem; color: var(--shu-strong); }
</style>
```

## `src/pages/work/[slug].astro` — case study

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Prose      from '../../components/Prose.astro';
import { PortableText } from 'astro-portabletext';
import { getProject, getProjects } from '../../content/queries';
import { urlFor } from '../../content/imageUrl';

export async function getStaticPaths() {
  const projects = await getProjects();
  return projects.map(p => ({ params: { slug: p.slug.current } }));
}

const { slug } = Astro.params;
const project  = await getProject(slug);
const cover    = project.cover ? urlFor(project.cover.asset).width(1200).height(630).fit('crop').url() : undefined;
---
<BaseLayout title={`${project.title} — Caio`} description={project.summary} ogImage={cover}>
  <article class="band">
    <div class="wrap">
      <header class="case-header">
        <p class="eyebrow">{project.role} · {project.period}</p>
        <h1>{project.title}</h1>
        <p class="lede">{project.summary}</p>
        <div class="case-meta">
          <div class="stack-chips">
            {project.stack.map(s => <span class="chip">{s}</span>)}
          </div>
          <div class="case-links">
            {project.links.map(l => (
              <a class="btn" href={l.url} target="_blank" rel="noopener">{l.label} ↗</a>
            ))}
          </div>
        </div>
      </header>

      {cover && (
        <img class="case-cover" src={cover} alt={project.cover!.alt} width="1200" height="630" loading="eager" />
      )}

      <Prose>
        <PortableText value={project.body} />
      </Prose>
    </div>
  </article>
</BaseLayout>

<style>
  .case-header { margin-bottom: 3rem; }
  .case-header h1 { font-size: clamp(2rem, 1.7rem + 1.3vw, 3rem); margin-top: .6rem; }
  .case-meta { display: flex; gap: 1.4rem; flex-wrap: wrap; align-items: center; margin-top: 2rem; }
  .stack-chips { display: flex; gap: .4rem; flex-wrap: wrap; }
  .case-links { display: flex; gap: .8rem; }
  .case-cover { width: 100%; height: auto; border: 1px solid var(--line); margin-bottom: 3rem; display: block; }
</style>
```

## Project grid CSS

```css
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0;
  margin-top: 2.2rem;
  border-top: 1px solid var(--line);
  border-left: 1px solid var(--line);
}
.project-grid .project-card {
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
```

## Definition of done

- `end: null` in Sanity renders as "Present" (never undefined, never "null").
- Project cover images have `alt` text (enforced by Zod schema).
- Case study pages have OG image = cover (cropped 1200×630).
- Work index page: Lighthouse ≥ 95.
- No JS shipped on these pages — pure HTML/CSS.
