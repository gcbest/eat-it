import { Tag, MeLocalQuery } from "generated/graphql";
import { ModalCategory, MealCategory } from "./enums";
import { CSSProperties } from "react";
import {Tag as ReactTag} from 'react-tag-autocomplete'

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
    extendedIngredients: string;
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
    variant: 
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light'
    | 'link'
    | 'outline-primary'
    | 'outline-secondary'
    | 'outline-success'
    | 'outline-danger'
    | 'outline-warning'
    | 'outline-info'
    | 'outline-dark'
    | 'outline-light';
}

export interface ModalProps<T> {
    params: T
    me?: User
    handleClose?: () => void
}

export interface ModalInterface {
    show: boolean
    modalType?: ModalCategory
    recipe?: Recipe
    tags?: Tag[]
    mealType?: MealCategory
    setMealType?: (mealType: MealCategory) => void
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
    tags: Tag[]
}

export interface ReducerAction {
    type: ModalCategory | string
    value?: any
}

export interface Image {
    src: string
    alt: string
    style?: CSSProperties
    caption?: string
    height?: string
    width?: string
    className?: string
    scrollPosition?: any
}

export interface CartItemInterface {
    id?: number
    name: string
    amount: number
    img?: string
    unit?: string
    aisle?: number
    isChecked: boolean
    isCleared: boolean
}

export interface CartItemEditables {
    [index: string]: boolean
    name: boolean
    amount: boolean
    unit: boolean
    aisle: boolean
}

export interface ShoppingCartInterface {
    items: CartItemInterface[]
}

export interface SlidingPaneInterface {
    isOpen: boolean,
    title?: any,
    subtitle?: any,
    onRequestClose?: () => void,
    onAfterOpen?: () => void,
    children: any,
    className?: string,
    overlayClassName?: string,
    closeIcon?: any,
    from?: 'left' | 'right' | 'bottom',
    width?: string,
    shouldCloseOnEsc?: boolean
}

export interface useFormInterface {
    inputs: any;
    handleChange(e: any): void;
    forceChange(updates: any): void;
    resetForm(): void;
    isRegistrationValid(): boolean;
    confirmPasswordsMatch(): boolean;
    isCreateRecipeValid(): boolean
}

export interface Me {
    user: MeLocalQuery | undefined
    loading: boolean
    // error: Error
  }