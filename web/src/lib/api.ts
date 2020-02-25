import axios from 'axios'

const SPOONACULAR_ENDPOINT = 'https://api.spoonacular.com/recipes'

interface RandomParams {
    tags: string;
    number: number;
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

export const spoonacular = {
    random: async (params: RandomParams) => {
        try {
            const results = await apiSpoonClient.get(`${SPOONACULAR_ENDPOINT}/random`, { params })
            // .catch(err => { throw new Error(`Error fetching random recipes: ${err}`) });
            return results;
        } catch (error) {
            return error;
        }
    }
}