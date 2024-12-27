import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeAnswer } from '../../tests/factories/make-answer'
import { InMemoryAnswersRepository } from '../../tests/repositories/in-memory-answers-repository'
import { ListQuestionAnswersUseCase } from './list-question-answers'

let answersRepository: InMemoryAnswersRepository
let sut: ListQuestionAnswersUseCase

describe('Forum -> Use Case: List Question Answers', async () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new ListQuestionAnswersUseCase(answersRepository)
  })

  it('should be possible to list question answers questions', async () => {
    const newAnswers = [
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
      makeAnswer({ questionId: new UniqueEntityId('question-2') }),
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
    ]

    newAnswers.forEach(async (answer) => await answersRepository.create(answer))

    const { answers } = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(answers).toHaveLength(2)
  })

  it('should be possible to list paginated question answers', async () => {
    Array.from({ length: 22 }).forEach(async () => {
      await answersRepository.create(
        makeAnswer({ questionId: new UniqueEntityId('question-1') }),
      )
    })

    const page1 = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    const page2 = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(page1.answers).toHaveLength(20)
    expect(page2.answers).toHaveLength(2)
  })
})
