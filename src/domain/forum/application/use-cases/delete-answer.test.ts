import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeAnswer } from '../../tests/factories/make-answer'
import { InMemoryAnswersRepository } from '../../tests/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'

let answersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Forum -> Use Case: Delete Answer', async () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(answersRepository)
  })

  it('should be possible to delete an answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await answersRepository.create(newAnswer)

    await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
    })

    expect(answersRepository.answers).toHaveLength(0)
  })

  it('should not be possible to delete a non-existent answer', async () => {
    await expect(() =>
      sut.execute({
        answerId: 'answer-1',
        authorId: 'author-1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be possible to delete an answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await answersRepository.create(newAnswer)

    await expect(() =>
      sut.execute({
        answerId: 'answer-1',
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
