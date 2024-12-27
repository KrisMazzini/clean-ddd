import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeAnswer } from '../../tests/factories/make-answer'
import { InMemoryAnswersRepository } from '../../tests/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-errort'

let answersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Forum -> Use Case: Edit Answer', async () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(answersRepository)
  })

  it('should be possible to edit an answer', async () => {
    const newAnswer = makeAnswer()

    await answersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
      content: 'New content',
    })

    expect(result.isRight()).toBe(true)
    expect(answersRepository.items[0].content).toBe('New content')
  })

  it('should not be possible to edit a answer from another user', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityId('author-1'),
    })

    await answersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-2',
      content: 'New content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be possible to edit a non-existent answer', async () => {
    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
      content: 'New content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
