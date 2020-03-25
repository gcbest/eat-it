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

export const GET_CART_ITEMS_BY_USER_ID = gql`
query GetCartItemsByUserId($id: Float!) {
getCartItemsByUserId(id: $id) {
    id
    name
    amount
    img
    units
    aisle
    isChecked
}
}
`

export const ADD_CART_ITEM = gql`
mutation AddCartItem($item: AddCartItem!) {
    addCartItem(item: $item) 
}
`

export const UPDATE_CART_ITEM_BY_ID = gql`
mutation UpdateCartItemById($item: EditCartItem!) {
    updateCartItemById(item: $item)
}
`

export const TOGGLE_CART_ITEM_CHECKED_BY_ID = gql`
mutation toggleCartItemCheckedById($id: Float!, $isChecked: Boolean!) {
    toggleCartItemCheckedById(id: $id, isChecked: $isChecked)
}
`

export const DELETE_CART_ITEM = gql`
mutation deleteCartItem($id: Float!) {
    deleteCartItem(id: $id)
}
`

