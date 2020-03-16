import gql from "graphql-tag";

export const DELETE_RECIPE_BY_ID = gql`
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
`

export const GET_ME = gql`
query meLocal {
    me {
        id
        email
        tags
        recipes {
            id
            title
            image
            mealType
        }
    }
}
`

export const GET_ME_LOCAL = gql`
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
`

export const ADD_RECIPE = gql`
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
`

export const GET_RECIPE_BY_ID = gql`
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
}`