import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeQuestion } from '../../tests/factories/make-question'
import { InMemoryQuestionsRepository } from '../../tests/repositories/in-memory-questions-repository'
import { ListRecentQuestionsUseCase } from './list-recent-questions'

let questionsRepository: InMemoryQuestionsRepository
let sut: ListRecentQuestionsUseCase

describe('Forum -> Use Case: List Recent Questions', async () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new ListRecentQuestionsUseCase(questionsRepository)
  })

  it('should be possible to list recent questions', async () => {
    const newQuestions = [
      makeQuestion(
        {
          createdAt: new Date('2024-12-26'),
        },
        new UniqueEntityId('question-1'),
      ),

      makeQuestion(
        {
          createdAt: new Date('2024-12-27'),
        },
        new UniqueEntityId('question-2'),
      ),

      makeQuestion(
        {
          createdAt: new Date('2025-01-17'),
        },
        new UniqueEntityId('question-3'),
      ),
    ]

    newQuestions.forEach(
      async (question) => await questionsRepository.create(question),
    )

    const { questions } = await sut.execute({
      page: 1,
    })

    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date('2025-01-17') }),
      expect.objectContaining({ createdAt: new Date('2024-12-27') }),
      expect.objectContaining({ createdAt: new Date('2024-12-26') }),
    ])
  })

  it('should be possible to list paginated recent questions', async () => {
    Array.from({ length: 22 }).forEach(async () => {
      await questionsRepository.create(makeQuestion())
    })

    const page1 = await sut.execute({
      page: 1,
    })

    const page2 = await sut.execute({
      page: 2,
    })

    expect(page1.questions).toHaveLength(20)
    expect(page2.questions).toHaveLength(2)
  })
})
