import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeAnswer } from '../../tests/factories/make-answer'
import { InMemoryAnswersRepository } from '../../tests/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'

let answersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Forum -> Use Case: Edit Answer', async () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(answersRepository)
  })

  it('should be possible to edit an answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await answersRepository.create(newAnswer)

    const { answer } = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
      content: 'New content',
    })

    expect(answer.content).toBe('New content')
  })

  it('should not be possible to edit a non-existent answer', async () => {
    await expect(() =>
      sut.execute({
        answerId: 'answer-1',
        authorId: 'author-1',
        content: 'New content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be possible to edit a answer from another user', async () => {
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
        content: 'New content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
