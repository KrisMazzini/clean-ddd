import { PaginationParams } from '@/core/repositories/pagination-params'

import { QuestionCommentsRepository } from '../../application/repositories/question-comments-repository'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public comments: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this.comments.push(questionComment)
  }

  async findById(id: string) {
    const comment = this.comments.find(
      (comment) => comment.id.toString() === id,
    )

    return comment ?? null
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const comments = this.comments
      .filter((answer) => answer.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return comments
  }

  async delete(questionComment: QuestionComment) {
    const commentIndex = this.comments.findIndex(
      (comment) => comment.id === questionComment.id,
    )

    this.comments.splice(commentIndex, 1)
  }
}
