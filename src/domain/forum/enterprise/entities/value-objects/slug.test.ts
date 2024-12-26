import { Slug } from './slug'

it('should be possible to create a new slug from text', async () => {
  const slug = Slug.createFromText('Example question title')

  expect(slug.value).toBe('example-question-title')
})
