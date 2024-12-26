import { Slug } from '../../enterprise/entities/value-objects/slug'
import { makeQuestion } from '../../tests/factories/make-question'
import { InMemoryQuestionsRepository } from '../../tests/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let questionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Forum -> Use Case: Get Question By Slug', async () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be possible to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('example-question'),
    })

    await questionsRepository.create(newQuestion)

    const { question } = await sut.execute({
      slug: 'example-question',
    })

    expect(question.id).toBe(newQuestion.id)
  })

  it('should not be possible to get a question using a non-existent slug', async () => {
    await expect(() =>
      sut.execute({
        slug: 'example-question',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
