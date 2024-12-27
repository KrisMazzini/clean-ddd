import { PaginationParams } from '@/core/repositories/pagination-params'

import { QuestionCommentsRepository } from '../../application/repositories/question-comments-repository'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async findById(id: string) {
    const item = this.items.find((item) => item.id.toString() === id)

    return item ?? null
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const items = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return items
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )

    this.items.splice(itemIndex, 1)
  }
}
