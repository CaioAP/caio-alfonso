import type { z } from 'zod';
import type {
  ExperienceSchema,
  PostListSchema,
  PostSchema,
  ProfileSchema,
  ProjectListSchema,
  ProjectSchema,
  SeriesSchema,
} from './schemas';

export type Post = z.infer<typeof PostSchema>;
export type PostListItem = z.infer<typeof PostListSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectListItem = z.infer<typeof ProjectListSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Series = z.infer<typeof SeriesSchema>;
