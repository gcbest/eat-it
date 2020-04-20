/* eslint-disable prettier/prettier */

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
    analyzedInstructions: string;
    tags?: Tag;
    mealType: number
}