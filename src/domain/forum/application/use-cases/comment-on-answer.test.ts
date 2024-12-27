import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeAnswer } from '../../tests/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from '../../tests/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from '../../tests/repositories/in-memory-answers-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'

let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Forum -> Use Case: Comment On Answer', async () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new CommentOnAnswerUseCase(
      answersRepository,
      answerCommentsRepository,
    )
  })

  it('should be possible to comment on a answer', async () => {
    const newAnswer = makeAnswer({}, new UniqueEntityId('answer-1'))

    await answersRepository.create(newAnswer)

    const { answerComment } = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-2',
      content: 'New comment',
    })

    expect(answerComment.id).toBeTruthy()
    expect(answerComment.content).toBe('New comment')
  })

  it('should not be possible to comment on a non-existent answer', async () => {
    await expect(() =>
      sut.execute({
        answerId: 'answer-1',
        authorId: 'author-1',
        content: 'New content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
