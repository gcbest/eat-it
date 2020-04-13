/* eslint-disable prettier/prettier */
// export interface Instructions {
//     name: string;
//     steps: Array<{
//         number: number;
//         step: string;
//         ingredients: Object[];
//         equipment: Object[];
//     }>;
// }

export interface Tag {
    id: number;
    name: string;
}

export interface RecipeInterface {
    id: number;
    title: string;
    readyInMinutes: number;
    servings: number;
    image: string;
    summary: string;
    sourceUrl: string;
    // analyzedInstructions: Instructions[];
    analyzedInstructions: string;
    tags?: Tag;
    mealType: number
}