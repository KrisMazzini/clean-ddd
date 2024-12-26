import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = []

  async create(question: Question) {
    this.questions.push(question)
  }

  async findById(id: string) {
    const question = this.questions.find(
      (question) => question.id.toString() === id,
    )

    return question ?? null
  }

  async findBySlug(slug: string) {
    const question = this.questions.find(
      (question) => question.slug.value === slug,
    )

    return question ?? null
  }

  async save(question: Question) {
    const questionIndex = this.questions.findIndex(
      (item) => item.id === question.id,
    )

    this.questions[questionIndex] = question
  }

  async delete(question: Question) {
    const questionIndex = this.questions.findIndex(
      (item) => item.id === question.id,
    )

    this.questions.splice(questionIndex, 1)
  }
}
