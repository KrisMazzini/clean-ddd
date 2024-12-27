import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeAnswerComment } from '../../tests/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from '../../tests/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Forum -> Use Case: Delete Answer Comment', async () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(answerCommentsRepository)
  })

  it('should be possible to delete an answer comment', async () => {
    const newAnswerComment = makeAnswerComment()

    await answerCommentsRepository.create(newAnswerComment)

    await sut.execute({
      answerCommentId: newAnswerComment.id.toString(),
      authorId: newAnswerComment.authorId.toString(),
    })

    expect(answerCommentsRepository.comments).toHaveLength(0)
  })

  it('should not be possible to delete a non-existent answer comment', async () => {
    await expect(() =>
      sut.execute({
        answerCommentId: 'answer-1',
        authorId: 'author-1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be possible to delete an answer comment from another user', async () => {
    const newAnswerComment = makeAnswerComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await answerCommentsRepository.create(newAnswerComment)

    await expect(() =>
      sut.execute({
        answerCommentId: newAnswerComment.id.toString(),
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
