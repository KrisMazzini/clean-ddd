import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeQuestionComment } from '../../tests/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from '../../tests/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-errort'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Forum -> Use Case: Delete Question Comment', async () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(questionCommentsRepository)
  })

  it('should be possible to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment()

    await questionCommentsRepository.create(newQuestionComment)

    const result = await sut.execute({
      questionCommentId: newQuestionComment.id.toString(),
      authorId: newQuestionComment.authorId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(questionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be possible to delete a question comment from another user', async () => {
    const newQuestionComment = makeQuestionComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await questionCommentsRepository.create(newQuestionComment)

    const result = await sut.execute({
      questionCommentId: newQuestionComment.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be possible to delete a non-existent question comment', async () => {
    const result = await sut.execute({
      questionCommentId: 'question-1',
      authorId: 'author-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
