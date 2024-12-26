import { Question } from '@/domain/forum/enterprise/entities/question'

import { QuestionsRepository } from '../questions-repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = []

  async create(question: Question) {
    this.questions.push(question)
  }
}
