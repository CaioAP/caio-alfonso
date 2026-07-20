import { defineField, defineType } from 'sanity';

export const profile = defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name' }),
    defineField({ name: 'headline', type: 'string', title: 'Headline' }),
    defineField({ name: 'bioShort', type: 'text', title: 'Bio (short, home page)' }),
    defineField({
      name: 'bio',
      type: 'array',
      of: [{ type: 'block' }],
      title: 'Bio (full, about page)',
    }),
    defineField({ name: 'location', type: 'string', title: 'Location' }),
    defineField({ name: 'email', type: 'string', title: 'Email' }),
    defineField({
      name: 'socials',
      type: 'array',
      title: 'Socials',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string' },
            { name: 'url', type: 'url' },
          ],
        },
      ],
    }),
    defineField({ name: 'cv', type: 'file', title: 'CV (PDF)' }),
    defineField({ name: 'availableForWork', type: 'boolean', title: 'Available for work?' }),
    defineField({
      name: 'photo',
      type: 'image',
      title: 'Profile photo',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
      validation: (r) => r.required(),
    }),
  ],
});
