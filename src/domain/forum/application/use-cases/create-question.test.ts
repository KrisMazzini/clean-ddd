import { InMemoryQuestionsRepository } from '../../tests/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'

let questionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Forum -> Use Case: Create Question', async () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be possible to create a question', async () => {
    const { question } = await sut.execute({
      authorId: '1',
      title: 'Nova pergunta',
      content: 'Conteúdo da pergunta',
    })

    expect(question.id).toBeTruthy()
    expect(questionsRepository.questions[0].id).toEqual(question.id)
    expect(question.title).toBe('Nova pergunta')
    expect(question.slug.value).toBe('nova-pergunta')
    expect(question.content).toBe('Conteúdo da pergunta')
  })
})
