import { PaginationParams } from '@/core/repositories/pagination-params'

import { AnswerCommentsRepository } from '../../application/repositories/answer-comments-repository'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public comments: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.comments.push(answerComment)
  }

  async findById(id: string) {
    const comment = this.comments.find(
      (comment) => comment.id.toString() === id,
    )

    return comment ?? null
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const comments = this.comments
      .filter((answer) => answer.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return comments
  }

  async delete(answerComment: AnswerComment) {
    const commentIndex = this.comments.findIndex(
      (comment) => comment.id === answerComment.id,
    )

    this.comments.splice(commentIndex, 1)
  }
}
