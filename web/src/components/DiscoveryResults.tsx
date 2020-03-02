import React, { useState, useContext } from 'react'
import { AxiosResponse } from 'axios';
import { DiscoveryCard } from './DiscoveryCard'
import CardDeck from 'react-bootstrap/CardDeck'
import { Recipe } from 'lib/interfaces';
import { QueryResult } from '@apollo/react-common';

// import { QueryContext } from 'pages/Discover'

interface Props {
    recipes: Recipe[] | Error | AxiosResponse | QueryResult | undefined;
}


const DiscoveryResults: React.FC<Props> = ({ recipes }) => {
    const DiscoveryCardList = (recipes: Recipe[]) => recipes.map(r => {
        // convert analyzedInstructions from string back into object
        r.analyzedInstructions = JSON.parse(r.analyzedInstructions)
        return < DiscoveryCard recipe={r} />
    })

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

export default React.memo(DiscoveryResults)