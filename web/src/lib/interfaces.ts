import { Tag } from "generated/graphql";
import { ModalCategory, MealCategory } from "./enums";

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

export interface ModalProps<T> {
    params: T
    me?: User
    handleClose?: () => void
}

export interface ModalInterface {
    show: boolean
    modalType?: ModalCategory
    recipe?: Recipe
    header?: string
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
}

export interface ReducerAction {
    type: ModalCategory | string
    value?: any
}

export interface Image {
    src: string
    alt: string
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
    units?: string
    aisle?: number
    isChecked: boolean
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