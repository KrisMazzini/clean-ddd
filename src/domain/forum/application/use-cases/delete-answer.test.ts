import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeAnswer } from '../../tests/factories/make-answer'
import { InMemoryAnswersRepository } from '../../tests/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-errort'

let answersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Forum -> Use Case: Delete Answer', async () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(answersRepository)
  })

  it('should be possible to delete an answer', async () => {
    const newAnswer = makeAnswer()

    await answersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(answersRepository.items).toHaveLength(0)
  })

  it('should not be possible to delete an answer from another user', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityId('author-1'),
    })

    await answersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be possible to delete a non-existent answer', async () => {
    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
