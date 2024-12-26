import { InMemoryAnswersRepository } from '../../tests/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

let answersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Forum -> Use Case: Answer Question', async () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(answersRepository)
  })

  it('should be possible to create an answer for a question', async () => {
    const { answer } = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'Nova resposta',
    })

    expect(answer.id).toBeTruthy()
    expect(answersRepository.answers[0].id).toEqual(answer.id)
    expect(answer.content).toBe('Nova resposta')
  })
})
