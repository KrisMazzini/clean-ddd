import { PaginationParams } from '@/core/repositories/pagination-params'

import { AnswerCommentsRepository } from '../../application/repositories/answer-comments-repository'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async findById(id: string) {
    const item = this.items.find((item) => item.id.toString() === id)

    return item ?? null
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const items = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return items
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )

    this.items.splice(itemIndex, 1)
  }
}
