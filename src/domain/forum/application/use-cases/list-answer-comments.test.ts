import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeAnswerComment } from '../../tests/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from '../../tests/repositories/in-memory-answer-comments-repository'
import { ListAnswerCommentsUseCase } from './list-answer-comments'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: ListAnswerCommentsUseCase

describe('Forum -> Use Case: List Answer Comments', async () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new ListAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be possible to list answer comments', async () => {
    const newAnswerComments = [
      makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
      makeAnswerComment({ answerId: new UniqueEntityId('answer-2') }),
      makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
    ]

    newAnswerComments.forEach(
      async (answer) => await answerCommentsRepository.create(answer),
    )

    const { answerComments } = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(answerComments).toHaveLength(2)
  })

  it('should be possible to list paginated answer comments', async () => {
    Array.from({ length: 22 }).forEach(async () => {
      await answerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
      )
    })

    const page1 = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    const page2 = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(page1.answerComments).toHaveLength(20)
    expect(page2.answerComments).toHaveLength(2)
  })
})
