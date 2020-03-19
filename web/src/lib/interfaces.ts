import { Tag } from "generated/graphql";
import { ModalCategory } from "./enums";

export interface Instructions {
    name: string;
    steps: Array<{
        number: number,
        step: string,
        ingredients: Object[],
        equipment: Object[]
    }>
}

export interface Recipe {
    id?: number;
    title: string;
    readyInMinutes: number;
    servings: number;
    image: string;
    summary: string;
    sourceUrl: string;
    // analyzedInstructions: Instructions[];
    analyzedInstructions: string;
    tags: Tag[];
    mealType: number;
    isStarred: boolean
    dishTypes?: string[]
}

export interface RecipeSlim {
    id: number
    title: string
    image: string
    mealType: number
    isStarred: boolean
    tags: Tag[]
    userId?: number
}

export interface CustomToggleInterface {
    children: any;
    eventKey: string;
}

export interface ModalInterface {
    show: boolean
    modalType?: ModalCategory
    recipe?: Recipe
    header?: string
    tags?: Tag[]
}

export interface AddRecipeInput extends Recipe {
    userId: number
    mealType: number
    __typename?: string

}

export interface User {
    id: number
    email: string
    recipes: [Recipe] | [RecipeSlim]
}

export interface ReducerAction {
    type: ModalCategory | string
    value?: any
}