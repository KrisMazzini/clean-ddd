import { makeAnswer } from '../../tests/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from '../../tests/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from '../../tests/repositories/in-memory-answers-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { ResourceNotFoundError } from './errors/resource-not-found-errort'

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
    const newAnswer = makeAnswer()

    await answersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-1',
      content: 'New comment',
    })

    expect(result.isRight()).toBe(true)
    expect(answerCommentsRepository.items[0].content).toBe('New comment')
  })

  it('should not be possible to comment on a non-existent answer', async () => {
    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
      content: 'New content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
