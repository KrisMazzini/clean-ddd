import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeQuestion } from '../../tests/factories/make-question'
import { InMemoryQuestionsRepository } from '../../tests/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'

let questionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Forum -> Use Case: Edit Question', async () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(questionsRepository)
  })

  it('should be possible to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await questionsRepository.create(newQuestion)

    const { question } = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
      title: 'New title',
      content: 'New content',
    })

    expect(question.title).toBe('New title')
    expect(question.content).toBe('New content')
  })

  it('should not be possible to edit a non-existent question', async () => {
    await expect(() =>
      sut.execute({
        questionId: 'question-1',
        authorId: 'author-1',
        title: 'New title',
        content: 'New content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be possible to edit a question from another user', async () => {
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
        title: 'New title',
        content: 'New content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
