/* eslint-disable prettier/prettier */
import axios from 'axios'

interface RandomParams {
    tags: string | undefined;
    number: number;
    apiKey?: string | undefined;
}

const SPOONACULAR_ENDPOINT = 'https://api.spoonacular.com/recipes'
export const spoonacular = {
    apiSpoonClient: axios.create({
        baseURL: SPOONACULAR_ENDPOINT,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json'
        }
    }),

    apiKey: process.env.SPOONACULAR_APIKEY,
    async random(params: RandomParams): Promise<any> {
        try {
            params.apiKey = this.apiKey;
            const { data: { recipes: randomRecipesArr } } = await this.apiSpoonClient.get(`${SPOONACULAR_ENDPOINT}/random`, { params });
            return randomRecipesArr;
        } catch (error) {
            // remove apiKey from params before showing message
            delete params.apiKey
            throw new Error(`Fetching random recipes with params: (${JSON.stringify(params)}) - ${error}`)
        }
    },
};
