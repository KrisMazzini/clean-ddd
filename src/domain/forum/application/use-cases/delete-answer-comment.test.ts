import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeAnswerComment } from '../../tests/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from '../../tests/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-errort'

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

    const result = await sut.execute({
      answerCommentId: newAnswerComment.id.toString(),
      authorId: newAnswerComment.authorId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(answerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be possible to delete an answer comment from another user', async () => {
    const newAnswerComment = makeAnswerComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await answerCommentsRepository.create(newAnswerComment)

    const result = await sut.execute({
      answerCommentId: newAnswerComment.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be possible to delete a non-existent answer comment', async () => {
    const result = await sut.execute({
      answerCommentId: 'answer-1',
      authorId: 'author-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
