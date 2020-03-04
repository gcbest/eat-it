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
}

export interface CustomToggleInterface {
    children: any;
    eventKey: string;
}

export interface ModalInterface {
    show: boolean
    handleShow?: (recipe: Recipe) => void
    handleClose: () => void
}

export interface AddRecipeInput extends Recipe {
    userId: number
    __typename?: string
}

export interface User {
    id: number
    email: string
}