import { Article } from './Article.ts'

export const Query = {
  async article(parent: any, { uuid }: any): Promise<Article> {
    return Article.find(uuid)
  },

  async articles(parent: any, { filter }: any): Promise<Article[]> {
    return Article.query().limit(10).offset(filter?.page * 10 || 0).all()
  }
}

export const Mutation = {
  async createArticle(parent: any, { input }: any): Promise<Article> {
    return new Article().set(input).save()
  },

  async updateArticle(parent: any, { uuid, input }: any): Promise<Article> {
    const article = await Article.find<Article>(uuid)
    return article.set(input).save()
  },

  async deleteArticle(parent: any, { uuid }: any): Promise<Boolean> {
    const article = await Article.find(uuid)
    await article.remove()
    return true
  },
}
