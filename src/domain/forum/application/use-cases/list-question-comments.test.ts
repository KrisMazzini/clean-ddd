import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeQuestionComment } from '../../tests/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from '../../tests/repositories/in-memory-question-comments-repository'
import { ListQuestionCommentsUseCase } from './list-question-comments'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: ListQuestionCommentsUseCase

describe('Forum -> Use Case: List Question Comments', async () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new ListQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be possible to list question comments', async () => {
    const newQuestionComments = [
      makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
      makeQuestionComment({ questionId: new UniqueEntityId('question-2') }),
      makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    ]

    newQuestionComments.forEach(
      async (answer) => await questionCommentsRepository.create(answer),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(2)
  })

  it('should be possible to list paginated question comments', async () => {
    Array.from({ length: 22 }).forEach(async () => {
      await questionCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
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

    expect(page1.isRight()).toBe(true)
    expect(page1.value?.questionComments).toHaveLength(20)

    expect(page2.isRight()).toBe(true)
    expect(page2.value?.questionComments).toHaveLength(2)
  })
})
