import { Answer } from '@/domain/forum/enterprise/entities/answer'

import { AnswersRepository } from '../answers-repository'

export class InMemoryAnswersRepository implements AnswersRepository {
  public answers: Answer[] = []

  async create(answer: Answer) {
    this.answers.push(answer)
  }
}
