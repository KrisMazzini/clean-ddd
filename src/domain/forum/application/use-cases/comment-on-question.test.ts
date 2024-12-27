import { makeQuestion } from '../../tests/factories/make-question'
import { InMemoryQuestionCommentsRepository } from '../../tests/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from '../../tests/repositories/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { ResourceNotFoundError } from './errors/resource-not-found-errort'

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
    const newQuestion = makeQuestion()

    await questionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-1',
      content: 'New comment',
    })

    expect(result.isRight()).toBe(true)
    expect(questionCommentsRepository.items[0].content).toBe('New comment')
  })

  it('should not be possible to comment on a non-existent question', async () => {
    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
      content: 'New content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
