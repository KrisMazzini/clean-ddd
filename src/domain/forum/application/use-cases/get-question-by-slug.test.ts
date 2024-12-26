import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { Question } from '../../enterprise/entities/question'
import { InMemoryQuestionsRepository } from '../repositories/in-memory/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let questionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Forum -> Use Case: Get Question By Slug', async () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be possible to get a question by slug', async () => {
    const newQuestion = Question.create({
      authorId: new UniqueEntityId('1'),
      title: 'Nova pergunta',
      content: 'Conteúdo da pergunta',
    })

    await questionsRepository.create(newQuestion)

    const { question } = await sut.execute({
      slug: 'nova-pergunta',
    })

    expect(question.id).toBe(newQuestion.id)
  })

  it('should not be possible to get a question using a non-existent slug', async () => {
    await expect(() =>
      sut.execute({
        slug: 'nova-pergunta',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
