import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type AddRecipeInput = {
  title: Scalars['String'],
  readyInMinutes: Scalars['Float'],
  servings: Scalars['Float'],
  image: Scalars['String'],
  summary: Scalars['String'],
  sourceUrl: Scalars['String'],
  analyzedInstructions: Scalars['String'],
  mealType: Scalars['Float'],
  isStarred: Scalars['Boolean'],
  tags: Array<Tag>,
  userId: Scalars['Float'],
};

export type EditRecipeInput = {
  id: Scalars['Float'],
  title: Scalars['String'],
  readyInMinutes: Scalars['Float'],
  servings: Scalars['Float'],
  image: Scalars['String'],
  summary: Scalars['String'],
  sourceUrl: Scalars['String'],
  analyzedInstructions: Scalars['String'],
  mealType: Scalars['Float'],
  isStarred: Scalars['Boolean'],
  tags: Array<Tag>,
  userId: Scalars['Float'],
};

export type LoginResponse = {
   __typename?: 'LoginResponse',
  accessToken: Scalars['String'],
  user: User,
};

export type Mutation = {
   __typename?: 'Mutation',
  logout: Scalars['Boolean'],
  revokeRefreshTokensForUser: Scalars['Boolean'],
  login: LoginResponse,
  register: Scalars['Boolean'],
  addRecipe?: Maybe<User>,
  updateRecipeById: User,
  toggleRecipeStar: User,
  deleteRecipeById: User,
};


export type MutationRevokeRefreshTokensForUserArgs = {
  userId: Scalars['Int']
};


export type MutationLoginArgs = {
  password: Scalars['String'],
  email: Scalars['String']
};


export type MutationRegisterArgs = {
  tags: Array<Tag>,
  diets: Scalars['String'],
  exerciseLevel: Scalars['Float'],
  password: Scalars['String'],
  email: Scalars['String']
};


export type MutationAddRecipeArgs = {
  input: AddRecipeInput
};


export type MutationUpdateRecipeByIdArgs = {
  input: EditRecipeInput
};


export type MutationToggleRecipeStarArgs = {
  isStarred: Scalars['Boolean'],
  recipeId: Scalars['Float'],
  userId: Scalars['Float']
};


export type MutationDeleteRecipeByIdArgs = {
  userId: Scalars['Float'],
  recipeId: Scalars['Float']
};

export type Query = {
   __typename?: 'Query',
  hello: Scalars['String'],
  bye: Scalars['String'],
  users: Array<User>,
  profile: User,
  me?: Maybe<User>,
  randomRecipes: Array<Recipe>,
  getRecipeById: Recipe,
};


export type QueryRandomRecipesArgs = {
  number: Scalars['Float'],
  tags: Scalars['String']
};


export type QueryGetRecipeByIdArgs = {
  id: Scalars['Float']
};

export type Recipe = {
   __typename?: 'Recipe',
  id: Scalars['Int'],
  title: Scalars['String'],
  readyInMinutes: Scalars['Int'],
  servings: Scalars['Int'],
  image: Scalars['String'],
  summary: Scalars['String'],
  sourceUrl: Scalars['String'],
  analyzedInstructions: Scalars['String'],
  isStarred: Scalars['Boolean'],
  dishTypes: Array<Scalars['String']>,
  tags: Array<TagInput>,
  mealType: Scalars['Int'],
};

export type RecipeInput = {
  id: Scalars['Int'],
  title: Scalars['String'],
  readyInMinutes: Scalars['Int'],
  servings: Scalars['Int'],
  image: Scalars['String'],
  summary: Scalars['String'],
  sourceUrl: Scalars['String'],
  analyzedInstructions: Scalars['String'],
  isStarred: Scalars['Boolean'],
  dishTypes: Array<Scalars['String']>,
  tags: Array<Tag>,
  mealType: Scalars['Int'],
};

export type Tag = {
  id: Scalars['String'],
  name: Scalars['String'],
};

export type TagInput = {
   __typename?: 'TagInput',
  id: Scalars['String'],
  name: Scalars['String'],
};

export type User = {
   __typename?: 'user',
  id: Scalars['Int'],
  email: Scalars['String'],
  exerciseLevel: Scalars['Float'],
  diets: Scalars['String'],
  tags: Array<TagInput>,
  recipes: Array<Recipe>,
};

export type AddRecipeMutationVariables = {
  recipe: AddRecipeInput
};


export type AddRecipeMutation = (
  { __typename?: 'Mutation' }
  & { addRecipe: Maybe<(
    { __typename?: 'user' }
    & Pick<User, 'id' | 'email'>
    & { recipes: Array<(
      { __typename?: 'Recipe' }
      & Pick<Recipe, 'id' | 'title' | 'image' | 'mealType'>
    )> }
  )> }
);

export type ByeQueryVariables = {};


export type ByeQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'bye'>
);

export type DeleteRecipeByIdMutationVariables = {
  recipeId: Scalars['Float'],
  userId: Scalars['Float']
};


export type DeleteRecipeByIdMutation = (
  { __typename?: 'Mutation' }
  & { deleteRecipeById: (
    { __typename?: 'user' }
    & Pick<User, 'id' | 'email'>
    & { recipes: Array<(
      { __typename?: 'Recipe' }
      & Pick<Recipe, 'id' | 'title' | 'image' | 'mealType'>
    )> }
  ) }
);

export type GetRecipeByIdQueryVariables = {
  id: Scalars['Float']
};


export type GetRecipeByIdQuery = (
  { __typename?: 'Query' }
  & { getRecipeById: (
    { __typename?: 'Recipe' }
    & Pick<Recipe, 'id' | 'title' | 'readyInMinutes' | 'servings' | 'image' | 'summary' | 'sourceUrl' | 'analyzedInstructions' | 'mealType' | 'isStarred'>
    & { tags: Array<(
      { __typename?: 'TagInput' }
      & Pick<TagInput, 'id' | 'name'>
    )> }
  ) }
);

export type HelloQueryVariables = {};


export type HelloQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'hello'>
);

export type LoginMutationVariables = {
  email: Scalars['String'],
  password: Scalars['String']
};


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'accessToken'>
    & { user: (
      { __typename?: 'user' }
      & Pick<User, 'id' | 'email'>
      & { tags: Array<(
        { __typename?: 'TagInput' }
        & Pick<TagInput, 'id' | 'name'>
      )>, recipes: Array<(
        { __typename?: 'Recipe' }
        & Pick<Recipe, 'id' | 'title' | 'image' | 'mealType' | 'isStarred'>
        & { tags: Array<(
          { __typename?: 'TagInput' }
          & Pick<TagInput, 'id' | 'name'>
        )> }
      )> }
    ) }
  ) }
);

export type LogoutMutationVariables = {};


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type MeQueryVariables = {};


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: Maybe<(
    { __typename?: 'user' }
    & Pick<User, 'id' | 'email'>
    & { tags: Array<(
      { __typename?: 'TagInput' }
      & Pick<TagInput, 'id' | 'name'>
    )>, recipes: Array<(
      { __typename?: 'Recipe' }
      & Pick<Recipe, 'id' | 'title' | 'image' | 'mealType' | 'isStarred'>
      & { tags: Array<(
        { __typename?: 'TagInput' }
        & Pick<TagInput, 'id' | 'name'>
      )> }
    )> }
  )> }
);

export type MeLocalQueryVariables = {};


export type MeLocalQuery = (
  { __typename?: 'Query' }
  & { me: Maybe<(
    { __typename?: 'user' }
    & Pick<User, 'id' | 'email'>
    & { tags: Array<(
      { __typename?: 'TagInput' }
      & Pick<TagInput, 'id' | 'name'>
    )>, recipes: Array<(
      { __typename?: 'Recipe' }
      & Pick<Recipe, 'id' | 'title' | 'image' | 'mealType' | 'isStarred'>
      & { tags: Array<(
        { __typename?: 'TagInput' }
        & Pick<TagInput, 'id' | 'name'>
      )> }
    )> }
  )> }
);

export type RandomRecipesQueryVariables = {
  tags: Scalars['String'],
  number: Scalars['Float']
};


export type RandomRecipesQuery = (
  { __typename?: 'Query' }
  & { randomRecipes: Array<(
    { __typename?: 'Recipe' }
    & Pick<Recipe, 'id' | 'title' | 'readyInMinutes' | 'servings' | 'image' | 'summary' | 'sourceUrl' | 'analyzedInstructions' | 'dishTypes'>
  )> }
);

export type RegisterMutationVariables = {
  email: Scalars['String'],
  password: Scalars['String'],
  exerciseLevel: Scalars['Float'],
  diets: Scalars['String'],
  tags: Array<Tag>
};


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'register'>
);

export type ToggleRecipeStarMutationVariables = {
  userId: Scalars['Float'],
  recipeId: Scalars['Float'],
  isStarred: Scalars['Boolean']
};


export type ToggleRecipeStarMutation = (
  { __typename?: 'Mutation' }
  & { toggleRecipeStar: (
    { __typename?: 'user' }
    & Pick<User, 'id' | 'email'>
    & { tags: Array<(
      { __typename?: 'TagInput' }
      & Pick<TagInput, 'id' | 'name'>
    )>, recipes: Array<(
      { __typename?: 'Recipe' }
      & Pick<Recipe, 'id' | 'title' | 'image' | 'mealType' | 'isStarred'>
      & { tags: Array<(
        { __typename?: 'TagInput' }
        & Pick<TagInput, 'id' | 'name'>
      )> }
    )> }
  ) }
);

export type UpdateRecipeByIdMutationVariables = {
  input: EditRecipeInput
};


export type UpdateRecipeByIdMutation = (
  { __typename?: 'Mutation' }
  & { updateRecipeById: (
    { __typename?: 'user' }
    & Pick<User, 'id' | 'email'>
    & { tags: Array<(
      { __typename?: 'TagInput' }
      & Pick<TagInput, 'id' | 'name'>
    )>, recipes: Array<(
      { __typename?: 'Recipe' }
      & Pick<Recipe, 'id' | 'title' | 'image' | 'mealType' | 'isStarred'>
      & { tags: Array<(
        { __typename?: 'TagInput' }
        & Pick<TagInput, 'id' | 'name'>
      )> }
    )> }
  ) }
);

export type UsersQueryVariables = {};


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'user' }
    & Pick<User, 'id' | 'email'>
  )> }
);

export const AddRecipeDocument = gql`
    mutation AddRecipe($recipe: AddRecipeInput!) {
  addRecipe(input: $recipe) {
    id
    email
    recipes {
      id
      title
      image
      mealType
    }
  }
}
    `;
export type AddRecipeMutationFn = ApolloReactCommon.MutationFunction<AddRecipeMutation, AddRecipeMutationVariables>;

    export function useAddRecipeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddRecipeMutation, AddRecipeMutationVariables>) {
      return ApolloReactHooks.useMutation<AddRecipeMutation, AddRecipeMutationVariables>(AddRecipeDocument, baseOptions);
    }
export type AddRecipeMutationHookResult = ReturnType<typeof useAddRecipeMutation>;
export type AddRecipeMutationResult = ApolloReactCommon.MutationResult<AddRecipeMutation>;
export type AddRecipeMutationOptions = ApolloReactCommon.BaseMutationOptions<AddRecipeMutation, AddRecipeMutationVariables>;
export const ByeDocument = gql`
    query Bye {
  bye
}
    `;

    export function useByeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ByeQuery, ByeQueryVariables>) {
      return ApolloReactHooks.useQuery<ByeQuery, ByeQueryVariables>(ByeDocument, baseOptions);
    }
      export function useByeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ByeQuery, ByeQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<ByeQuery, ByeQueryVariables>(ByeDocument, baseOptions);
      }
      
export type ByeQueryHookResult = ReturnType<typeof useByeQuery>;
export type ByeQueryResult = ApolloReactCommon.QueryResult<ByeQuery, ByeQueryVariables>;
export const DeleteRecipeByIdDocument = gql`
    mutation DeleteRecipeById($recipeId: Float!, $userId: Float!) {
  deleteRecipeById(recipeId: $recipeId, userId: $userId) {
    id
    email
    recipes {
      id
      title
      image
      mealType
    }
  }
}
    `;
export type DeleteRecipeByIdMutationFn = ApolloReactCommon.MutationFunction<DeleteRecipeByIdMutation, DeleteRecipeByIdMutationVariables>;

    export function useDeleteRecipeByIdMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteRecipeByIdMutation, DeleteRecipeByIdMutationVariables>) {
      return ApolloReactHooks.useMutation<DeleteRecipeByIdMutation, DeleteRecipeByIdMutationVariables>(DeleteRecipeByIdDocument, baseOptions);
    }
export type DeleteRecipeByIdMutationHookResult = ReturnType<typeof useDeleteRecipeByIdMutation>;
export type DeleteRecipeByIdMutationResult = ApolloReactCommon.MutationResult<DeleteRecipeByIdMutation>;
export type DeleteRecipeByIdMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteRecipeByIdMutation, DeleteRecipeByIdMutationVariables>;
export const GetRecipeByIdDocument = gql`
    query GetRecipeById($id: Float!) {
  getRecipeById(id: $id) {
    id
    title
    readyInMinutes
    servings
    image
    summary
    sourceUrl
    analyzedInstructions
    mealType
    isStarred
    tags {
      id
      name
    }
  }
}
    `;

    export function useGetRecipeByIdQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRecipeByIdQuery, GetRecipeByIdQueryVariables>) {
      return ApolloReactHooks.useQuery<GetRecipeByIdQuery, GetRecipeByIdQueryVariables>(GetRecipeByIdDocument, baseOptions);
    }
      export function useGetRecipeByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRecipeByIdQuery, GetRecipeByIdQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<GetRecipeByIdQuery, GetRecipeByIdQueryVariables>(GetRecipeByIdDocument, baseOptions);
      }
      
export type GetRecipeByIdQueryHookResult = ReturnType<typeof useGetRecipeByIdQuery>;
export type GetRecipeByIdQueryResult = ApolloReactCommon.QueryResult<GetRecipeByIdQuery, GetRecipeByIdQueryVariables>;
export const HelloDocument = gql`
    query Hello {
  hello
}
    `;

    export function useHelloQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<HelloQuery, HelloQueryVariables>) {
      return ApolloReactHooks.useQuery<HelloQuery, HelloQueryVariables>(HelloDocument, baseOptions);
    }
      export function useHelloLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<HelloQuery, HelloQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<HelloQuery, HelloQueryVariables>(HelloDocument, baseOptions);
      }
      
export type HelloQueryHookResult = ReturnType<typeof useHelloQuery>;
export type HelloQueryResult = ApolloReactCommon.QueryResult<HelloQuery, HelloQueryVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
    user {
      id
      email
      tags {
        id
        name
      }
      recipes {
        id
        title
        image
        mealType
        isStarred
        tags {
          id
          name
        }
      }
    }
  }
}
    `;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;

    export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
      return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
    }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = ApolloReactCommon.MutationFunction<LogoutMutation, LogoutMutationVariables>;

    export function useLogoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
      return ApolloReactHooks.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
    }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReactCommon.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = ApolloReactCommon.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    email
    tags {
      id
      name
    }
    recipes {
      id
      title
      image
      mealType
      isStarred
      tags {
        id
        name
      }
    }
  }
}
    `;

    export function useMeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>) {
      return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
    }
      export function useMeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
      
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>;
export const MeLocalDocument = gql`
    query meLocal {
  me @client {
    id
    email
    tags {
      id
      name
    }
    recipes {
      id
      title
      image
      mealType
      isStarred
      tags {
        id
        name
      }
    }
  }
}
    `;

    export function useMeLocalQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MeLocalQuery, MeLocalQueryVariables>) {
      return ApolloReactHooks.useQuery<MeLocalQuery, MeLocalQueryVariables>(MeLocalDocument, baseOptions);
    }
      export function useMeLocalLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeLocalQuery, MeLocalQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<MeLocalQuery, MeLocalQueryVariables>(MeLocalDocument, baseOptions);
      }
      
export type MeLocalQueryHookResult = ReturnType<typeof useMeLocalQuery>;
export type MeLocalQueryResult = ApolloReactCommon.QueryResult<MeLocalQuery, MeLocalQueryVariables>;
export const RandomRecipesDocument = gql`
    query randomRecipes($tags: String!, $number: Float!) {
  randomRecipes(tags: $tags, number: $number) {
    id
    title
    readyInMinutes
    servings
    image
    summary
    sourceUrl
    analyzedInstructions
    dishTypes
  }
}
    `;

    export function useRandomRecipesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<RandomRecipesQuery, RandomRecipesQueryVariables>) {
      return ApolloReactHooks.useQuery<RandomRecipesQuery, RandomRecipesQueryVariables>(RandomRecipesDocument, baseOptions);
    }
      export function useRandomRecipesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<RandomRecipesQuery, RandomRecipesQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<RandomRecipesQuery, RandomRecipesQueryVariables>(RandomRecipesDocument, baseOptions);
      }
      
export type RandomRecipesQueryHookResult = ReturnType<typeof useRandomRecipesQuery>;
export type RandomRecipesQueryResult = ApolloReactCommon.QueryResult<RandomRecipesQuery, RandomRecipesQueryVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!, $exerciseLevel: Float!, $diets: String!, $tags: [Tag!]!) {
  register(email: $email, password: $password, exerciseLevel: $exerciseLevel, diets: $diets, tags: $tags)
}
    `;
export type RegisterMutationFn = ApolloReactCommon.MutationFunction<RegisterMutation, RegisterMutationVariables>;

    export function useRegisterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
      return ApolloReactHooks.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
    }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = ApolloReactCommon.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = ApolloReactCommon.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const ToggleRecipeStarDocument = gql`
    mutation ToggleRecipeStar($userId: Float!, $recipeId: Float!, $isStarred: Boolean!) {
  toggleRecipeStar(userId: $userId, recipeId: $recipeId, isStarred: $isStarred) {
    id
    email
    tags {
      id
      name
    }
    recipes {
      id
      title
      image
      mealType
      isStarred
      tags {
        id
        name
      }
    }
  }
}
    `;
export type ToggleRecipeStarMutationFn = ApolloReactCommon.MutationFunction<ToggleRecipeStarMutation, ToggleRecipeStarMutationVariables>;

    export function useToggleRecipeStarMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ToggleRecipeStarMutation, ToggleRecipeStarMutationVariables>) {
      return ApolloReactHooks.useMutation<ToggleRecipeStarMutation, ToggleRecipeStarMutationVariables>(ToggleRecipeStarDocument, baseOptions);
    }
export type ToggleRecipeStarMutationHookResult = ReturnType<typeof useToggleRecipeStarMutation>;
export type ToggleRecipeStarMutationResult = ApolloReactCommon.MutationResult<ToggleRecipeStarMutation>;
export type ToggleRecipeStarMutationOptions = ApolloReactCommon.BaseMutationOptions<ToggleRecipeStarMutation, ToggleRecipeStarMutationVariables>;
export const UpdateRecipeByIdDocument = gql`
    mutation UpdateRecipeById($input: EditRecipeInput!) {
  updateRecipeById(input: $input) {
    id
    email
    tags {
      id
      name
    }
    recipes {
      id
      title
      image
      mealType
      isStarred
      tags {
        id
        name
      }
    }
  }
}
    `;
export type UpdateRecipeByIdMutationFn = ApolloReactCommon.MutationFunction<UpdateRecipeByIdMutation, UpdateRecipeByIdMutationVariables>;

    export function useUpdateRecipeByIdMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateRecipeByIdMutation, UpdateRecipeByIdMutationVariables>) {
      return ApolloReactHooks.useMutation<UpdateRecipeByIdMutation, UpdateRecipeByIdMutationVariables>(UpdateRecipeByIdDocument, baseOptions);
    }
export type UpdateRecipeByIdMutationHookResult = ReturnType<typeof useUpdateRecipeByIdMutation>;
export type UpdateRecipeByIdMutationResult = ApolloReactCommon.MutationResult<UpdateRecipeByIdMutation>;
export type UpdateRecipeByIdMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateRecipeByIdMutation, UpdateRecipeByIdMutationVariables>;
export const UsersDocument = gql`
    query Users {
  users {
    id
    email
  }
}
    `;

    export function useUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
      return ApolloReactHooks.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
    }
      export function useUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
      }
      
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersQueryResult = ApolloReactCommon.QueryResult<UsersQuery, UsersQueryVariables>;