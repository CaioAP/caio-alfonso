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
  plugins: [structureTool(), visionTool()],
  schema: { types: schemas },
});
