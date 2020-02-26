import axios from 'axios'
// import { ok, Ok, err, Err, Result } from 'neverthrow'


const SPOONACULAR_ENDPOINT = 'https://api.spoonacular.com/recipes'

interface RandomParams {
    tags: string | undefined;
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

// type DbResult<T> = Result<T, DbError>;
interface SpoonError {
    statusCode: number;
    message: string;
}

// type SpoonResult<T> = Result<T, SpoonError>;


export const spoonacular = {
    random: async (params: RandomParams) => {
        try {
            debugger;
            const results = await apiSpoonClient.get(`${SPOONACULAR_ENDPOINT}/random`, { params })
            // .catch(err => { throw new Error(`Error fetching random recipes: ${err}`) });
            debugger;
            return results;
        } catch (error) {
            // throw error;
            throw new Error(`Fetching random recipes with params: (${JSON.stringify(params)}) - ${error}`)
            // return err(new Error(error))
        }
    }
}