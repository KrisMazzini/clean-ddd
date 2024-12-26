import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeQuestion } from '../../tests/factories/make-question'
import { InMemoryQuestionsRepository } from '../../tests/repositories/in-memory-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'

let questionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Forum -> Use Case: Delete Question', async () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(questionsRepository)
  })

  it('should be possible to delete a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await questionsRepository.create(newQuestion)

    await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
    })

    expect(questionsRepository.questions).toHaveLength(0)
  })

  it('should not be possible to delete a non-existent question', async () => {
    await expect(() =>
      sut.execute({
        questionId: 'question-1',
        authorId: 'author-1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be possible to delete a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await questionsRepository.create(newQuestion)

    await expect(() =>
      sut.execute({
        questionId: 'question-1',
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
