import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeQuestion } from '../../tests/factories/make-question'
import { InMemoryQuestionCommentsRepository } from '../../tests/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from '../../tests/repositories/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'

let questionsRepository: InMemoryQuestionsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Forum -> Use Case: Comment On Question', async () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()

    sut = new CommentOnQuestionUseCase(
      questionsRepository,
      questionCommentsRepository,
    )
  })

  it('should be possible to comment on a question', async () => {
    const newQuestion = makeQuestion({}, new UniqueEntityId('question-1'))

    await questionsRepository.create(newQuestion)

    const { questionComment } = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-2',
      content: 'New comment',
    })

    expect(questionComment.id).toBeTruthy()
    expect(questionComment.content).toBe('New comment')
  })

  it('should not be possible to comment on a non-existent question', async () => {
    await expect(() =>
      sut.execute({
        questionId: 'question-1',
        authorId: 'author-1',
        content: 'New content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
