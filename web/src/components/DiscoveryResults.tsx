import React, { useState, useContext } from 'react'
import { AxiosResponse } from 'axios';
import { DiscoveryCard } from './DiscoveryCard'
import CardDeck from 'react-bootstrap/CardDeck'
import { Recipe } from 'lib/interfaces';
// import { QueryContext } from 'pages/Discover'

interface Props {
    // recipes: Recipe[] | Error | AxiosResponse | undefined;
    recipes: Object[] | Error | AxiosResponse | undefined;
}


export const DiscoveryResults: React.FC<Props> = ({ recipes }) => {
    // const DiscoveryCardList = (recipes: Recipe[]) => recipes.map(r => <DiscoveryCard recipe={r} />)
    const DiscoveryCardList = (recipes: Object[]) => recipes.map(r => <DiscoveryCard recipe={r} />)

    return (
        <div>
            {
                // !loading && 
                // Array.isArray(recipes) && recipes.length > 0 ? recipes.map(r => <DiscoveryCard key={r.id} recipe={r} />) : null
                Array.isArray(recipes) && recipes.length > 0 ? <CardDeck> {DiscoveryCardList(recipes)}  </CardDeck> : null
            }
        </div>
    )
}

