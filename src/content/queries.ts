import { sanity, sanityConfigured } from './client';
import {
  fixtureExperiences,
  fixturePosts,
  fixtureProfile,
  fixtureProjects,
  fixtureSeries,
} from './fixtures';
import {
  ExperienceSchema,
  PostListSchema,
  PostSchema,
  ProfileSchema,
  ProjectListSchema,
  ProjectSchema,
  SeriesSchema,
} from './schemas';
import type {
  Experience,
  Post,
  PostListItem,
  Profile,
  Project,
  ProjectListItem,
  Series,
} from './types';

let warned = false;
function warnFixtures() {
  if (!warned) {
    warned = true;
    console.warn(
      '[content] SANITY_PROJECT_ID not set — building from local fixtures. ' +
        'Set the Sanity env vars (.env.example) to build from real content.',
    );
  }
}

/** Throws if content fails Zod validation — fails the build loudly. */
function validate<T>(schema: { parse(d: unknown): T }, data: unknown): T {
  return schema.parse(data);
}

function client() {
  if (!sanity) throw new Error('Sanity client not configured');
  return sanity;
}

export async function getPosts(): Promise<PostListItem[]> {
  if (!sanityConfigured) {
    warnFixtures();
    return fixturePosts.map((d) => validate(PostListSchema, d));
  }
  const data = await client().fetch(`
    *[_type == "post" && !draft] | order(publishedAt desc) {
      _id, title, slug, publishedAt, updatedAt, excerpt, cover, tags,
      series->{ title, slug }, draft
    }
  `);
  return (data as unknown[]).map((d) => validate(PostListSchema, d));
}

export async function getPost(slug: string): Promise<Post> {
  if (!sanityConfigured) {
    warnFixtures();
    const post = fixturePosts.find((p) => p.slug.current === slug);
    if (!post) throw new Error(`Post not found: ${slug}`);
    return validate(PostSchema, post);
  }
  const data = await client().fetch(
    `*[_type == "post" && slug.current == $slug && !draft][0] {
      _id, title, slug, publishedAt, updatedAt, excerpt, cover, tags,
      series->{ title, slug }, body, draft
    }`,
    { slug },
  );
  if (!data) throw new Error(`Post not found: ${slug}`);
  return validate(PostSchema, data);
}

export async function getProjects(): Promise<ProjectListItem[]> {
  if (!sanityConfigured) {
    warnFixtures();
    return fixtureProjects.map((d) => validate(ProjectListSchema, d));
  }
  const data = await client().fetch(`
    *[_type == "project"] | order(order asc) {
      _id, title, slug, role, period, stack, summary, links, cover, featured, order
    }
  `);
  return (data as unknown[]).map((d) => validate(ProjectListSchema, d));
}

export async function getProject(slug: string): Promise<Project> {
  if (!sanityConfigured) {
    warnFixtures();
    const project = fixtureProjects.find((p) => p.slug.current === slug);
    if (!project) throw new Error(`Project not found: ${slug}`);
    return validate(ProjectSchema, project);
  }
  const data = await client().fetch(`*[_type == "project" && slug.current == $slug][0]`, {
    slug,
  });
  if (!data) throw new Error(`Project not found: ${slug}`);
  return validate(ProjectSchema, data);
}

export async function getExperiences(): Promise<Experience[]> {
  if (!sanityConfigured) {
    warnFixtures();
    return fixtureExperiences.map((d) => validate(ExperienceSchema, d));
  }
  const data = await client().fetch(`*[_type == "experience"] | order(order asc)`);
  return (data as unknown[]).map((d) => validate(ExperienceSchema, d));
}

export async function getProfile(): Promise<Profile> {
  if (!sanityConfigured) {
    warnFixtures();
    return validate(ProfileSchema, fixtureProfile);
  }
  const data = await client().fetch(`*[_type == "profile"][0]`);
  if (!data) throw new Error('Profile document missing in Sanity');
  return validate(ProfileSchema, data);
}

export async function getSeriesList(): Promise<Series[]> {
  if (!sanityConfigured) {
    warnFixtures();
    return fixtureSeries.map((d) => validate(SeriesSchema, d));
  }
  const data = await client().fetch(`*[_type == "series"] | order(title asc)`);
  return (data as unknown[]).map((d) => validate(SeriesSchema, d));
}
