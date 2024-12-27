import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeAnswer } from '../../tests/factories/make-answer'
import { makeQuestion } from '../../tests/factories/make-question'
import { InMemoryAnswersRepository } from '../../tests/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from '../../tests/repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'

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
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await questionsRepository.create(newQuestion)

    const newAnswer = makeAnswer(
      {
        questionId: new UniqueEntityId('question-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await answersRepository.create(newAnswer)

    const { question } = await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
    })

    expect(question.bestAnswerId?.toString()).toBe('answer-1')
  })

  it('should not be possible to choose a non-existent answer as best answer for a question', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'author-1',
        answerId: 'answer-1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be possible to choose the best answer for a non-existent question', async () => {
    const newAnswer = makeAnswer(
      {
        questionId: new UniqueEntityId('question-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await answersRepository.create(newAnswer)

    await expect(() =>
      sut.execute({
        authorId: 'author-1',
        answerId: 'answer-1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be possible to choose the best answer for a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await questionsRepository.create(newQuestion)

    const newAnswer = makeAnswer(
      {
        questionId: new UniqueEntityId('question-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await answersRepository.create(newAnswer)

    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        answerId: 'answer-1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
