import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeAnswer } from '../../tests/factories/make-answer'
import { makeQuestion } from '../../tests/factories/make-question'
import { InMemoryAnswersRepository } from '../../tests/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from '../../tests/repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-errort'

let questionsRepository: InMemoryQuestionsRepository
let answersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Forum -> Use Case: Choose Question Best Answer', async () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    answersRepository = new InMemoryAnswersRepository()

    sut = new ChooseQuestionBestAnswerUseCase(
      questionsRepository,
      answersRepository,
    )
  })

  it('should be possible to choose the best answer for a question', async () => {
    const newQuestion = makeQuestion()

    await questionsRepository.create(newQuestion)

    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    })

    await answersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: newQuestion.authorId.toString(),
      answerId: newAnswer.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(questionsRepository.items[0].bestAnswerId).toEqual(newAnswer.id)
  })

  it('should not be possible to choose the best answer for a question from another user', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-1'),
    })

    await questionsRepository.create(newQuestion)

    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    })

    await answersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: newAnswer.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be possible to choose a non-existent answer as best answer for a question', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be possible to choose the best answer for a non-existent question', async () => {
    const newAnswer = makeAnswer()

    await answersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'author-1',
      answerId: newAnswer.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
