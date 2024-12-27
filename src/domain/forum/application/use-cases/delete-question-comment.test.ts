import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeQuestionComment } from '../../tests/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from '../../tests/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'

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

    await sut.execute({
      questionCommentId: newQuestionComment.id.toString(),
      authorId: newQuestionComment.authorId.toString(),
    })

    expect(questionCommentsRepository.comments).toHaveLength(0)
  })

  it('should not be possible to delete a non-existent question comment', async () => {
    await expect(() =>
      sut.execute({
        questionCommentId: 'question-1',
        authorId: 'author-1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be possible to delete a question comment from another user', async () => {
    const newQuestionComment = makeQuestionComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await questionCommentsRepository.create(newQuestionComment)

    await expect(() =>
      sut.execute({
        questionCommentId: newQuestionComment.id.toString(),
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
