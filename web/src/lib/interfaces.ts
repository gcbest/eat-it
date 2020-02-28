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
    id: number;
    title: string;
    readyInMinutes: number;
    servings: number;
    image: string;
    summary: string;
    sourceUrl: string;
    analyzedInstructions: Instructions[];
}

export interface CustomToggleInterface {
    children: any;
    eventKey: string;
}