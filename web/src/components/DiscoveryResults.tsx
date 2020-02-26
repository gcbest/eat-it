import React, { useState, useContext } from 'react'
import { DiscoveryCard } from './DiscoveryCard'
import { AxiosResponse } from 'axios';
// import { QueryContext } from 'pages/Discover'

interface Props {
    recipes: Recipe[] | Error | AxiosResponse | undefined;
}

interface Recipe {
    title: string;
}

export const DiscoveryResults: React.FC<Props> = ({ recipes }) => {
    //TODO: use context for search results
    // const query = useContext(QueryContext)

    // const [results, setResults] = useState([])
    // console.log(recipes);
    // debugger;

    return (
        <div>
            {
                // !loading && 
                Array.isArray(recipes) && recipes.length > 0 ? recipes.map(r => <DiscoveryCard recipe={r} />) : null
                // <DiscoveryCard recipe={{}} />

            }
        </div>
    )
}

