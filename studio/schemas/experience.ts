import { defineField, defineType } from 'sanity';

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({ name: 'company', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'start', type: 'date', validation: (r) => r.required() }),
    defineField({ name: 'end', type: 'date' }), // null = Present
    defineField({ name: 'location', type: 'string' }),
    defineField({ name: 'highlights', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'stack', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'order', type: 'number' }),
  ],
});
