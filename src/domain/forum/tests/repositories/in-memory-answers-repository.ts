import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public answers: Answer[] = []

  async create(answer: Answer) {
    this.answers.push(answer)
  }

  async findById(id: string) {
    const answer = this.answers.find((answer) => answer.id.toString() === id)

    return answer ?? null
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.answers
      .filter((answer) => answer.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async save(answer: Answer) {
    const answerIndex = this.answers.findIndex((item) => item.id === answer.id)

    this.answers[answerIndex] = answer
  }

  async delete(answer: Answer) {
    const answerIndex = this.answers.findIndex((item) => item.id === answer.id)

    this.answers.splice(answerIndex, 1)
  }
}
