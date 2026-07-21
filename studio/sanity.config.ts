import { codeInput } from '@sanity/code-input';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemas } from './schemas';

export default defineConfig({
  name: 'caio-portfolio',
  title: 'Caio Portfolio',
  // projectId is public — it ships in the Studio client bundle. Not a secret.
  projectId: 'ftpb674o',
  dataset: 'production',
  // codeInput registers the `code` type used by post.body (see docs/02 §4).
  plugins: [structureTool(), visionTool(), codeInput()],
  schema: { types: schemas },
});
