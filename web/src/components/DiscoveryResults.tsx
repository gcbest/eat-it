import React, { useState, useContext } from 'react'
import { DiscoveryCard } from './DiscoveryCard'
import { AxiosResponse } from 'axios';
import { Recipe } from 'lib/interfaces';
// import { QueryContext } from 'pages/Discover'

interface Props {
    recipes: Recipe[] | Error | AxiosResponse | undefined;
}


export const DiscoveryResults: React.FC<Props> = ({ recipes }) => {
    return (
        <div>
            {
                // !loading && 
                Array.isArray(recipes) && recipes.length > 0 ? recipes.map(r => <DiscoveryCard key={r.id} recipe={r} />) : null
            }
        </div>
    )
}

