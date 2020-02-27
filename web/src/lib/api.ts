import axios from 'axios'

const SPOONACULAR_ENDPOINT = 'https://api.spoonacular.com/recipes'

interface RandomParams {
    tags: string | undefined;
    number: number;
    apiKey?: string | undefined;
}

const apiSpoonClient = axios.create({
    baseURL: SPOONACULAR_ENDPOINT,
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json'
    }
});

const apiClient = axios.create({
    baseURL: process.env.PORT || 'localhost:4000',
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json'
    }
});

interface SpoonError {
    statusCode: number;
    message: string;
}

export const spoonacular = {
    random: async (params: RandomParams) => {
        params.apiKey = process.env.SPOONACULAR_APIKEY;
        try {
            const results = await apiSpoonClient.get(`${SPOONACULAR_ENDPOINT}/random`, { params })
            return results;
        } catch (error) {
            throw new Error(`Fetching random recipes with params: (${JSON.stringify(params)}) - ${error}`)
        }
    }
}