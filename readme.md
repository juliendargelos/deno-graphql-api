# deno-graphql-api

Template for a deno modular GraphQL api.

### Modules

The API is splitted in several modules located in the `modules` folder. To add a module, create a file `modules/mymodule/mod.ts`. A module can export a set of models, resolvers and GraphQL types thath will be passed to [cotton](https://github.com/rahmanfadhil/cotton) and [oak_graphql](https://github.com/aaronwlee/oak-graphql)

#### CRUD module

This is the [article crud module example](modules/article):

**Define types**

```graphql
# modules/articles/types.ts

type Article {
  uuid: ID!
  title: String!
  content: String!
}

input ArticleInput {
  title: String
  content: String
}

input ArticleFilter {
  page: Int
}

extend type Query {
  article(uuid: ID!): Article!
  articles(filter: ArticleFilter): [Article!]!
}

extend type Mutation {
  createArticle(input: ArticleInput!): Article!
  updateArticle(uuid: ID!, input: ArticleInput!): Article!
  deleteArticle(uuid: ID!): Boolean!
}
```

**Define a model**

```typescript
// modules/articles/Article.ts

import { BaseModel, Model, Column, DataType } from '~/modules/core/Model.ts'

@Model('articles') export class Article extends BaseModel {
  @Column({ type: DataType.String }) title!: string
  @Column({ type: DataType.String }) content!: string
}
```

**Define resolvers**

```typescript
// modules/articles/resolvers.ts

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
```

**Export from mod.ts**

```typescript
import { Article } from './Article.ts'

export * as resolvers from './resolvers.ts'

export const types = Deno.readTextFileSync(
  new URL('types.graphql', import.meta.url)
)

export const models = [
  Article
]
```

#### Core module

The core module contains the logic to autoload all other modules and exports orm tools from cotton to define models as above.

#### User module

Base user model and resolvers.

#### Authentication module

Adds the ability to authenticate users with jwt. It also injects an `authentication` object in the resolvers context.

**Authenticate**

```graphql
mutation($input: AuthenticationInput!) {
  createAuthentication(input: $input) {
    token
  }
}

# input:
# {
#   "email": "lorem@mail.com",
#   "password": "password123"
# }
```

The `Authorization` header must then be set with the returned token.

**Get authentication infos**

```graphql
{
  authentication {
    token
    user {
      name
      email
    }
  }
}
```

**Ensure authentication**

```typescript
import { Article } from './Article.ts'

export const Mutation = {
  async createArticle(parent: any, { input }: any, { authentication }: any) {
    authentication.require() // Will throw if the user is not authenticated

    return new Article()
      .set({ ...input, author: authentication.user })
      .save()
  }
}
```

### Scripts

You can run the following scripts using [denon](https://github.com/denosaurs/denon):

| Command              | Description |
|----------------------|-------------|
| `denon install`      | Caches project dependencies and writes lockfile. Add the `--reload` flag to update the cache. |
| `denon start`        | Starts the server and watches for changes unless `DENO_ENV` is set to `production`. |
| `denon cotton migration:create -n NAME` | Creates a new migration. |
| `denon cotton migration:up` | Runs migrations upward. |
| `denon cotton migration:down` | Runs migrations downward. |
| `denon docker:build` | Builds a docker image from project. |
| `denon docker:start` | Runs `denon start` from the built docker image. |
