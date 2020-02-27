/* eslint-disable prettier/prettier */
import axios from 'axios'
// import { Recipe } from 'src/entity/Recipe';

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
            console.log('sending request to spoonacular');
            const results = await this.apiSpoonClient.get(`${SPOONACULAR_ENDPOINT}/random`, { params });
            return results;
        } catch (error) {
            throw new Error(`Fetching random recipes with params: (${JSON.stringify(params)}) - ${error}`);
        }
    },
};
