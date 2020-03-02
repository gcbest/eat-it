import React from 'react'
import { DiscoveryCard } from './DiscoveryCard'
import CardDeck from 'react-bootstrap/CardDeck'
import { Recipe } from 'lib/interfaces';

interface Props {
    recipes: Recipe[] | Error | undefined;
}


export const DiscoveryResults: React.FC<Props> = ({ recipes }) => {
    const DiscoveryCardList = (recipes: Recipe[]) => recipes.map(r => <DiscoveryCard key={r.id} recipe={r} />)

    return (
        <div>
            {Array.isArray(recipes) && recipes.length > 0 ? <CardDeck> {DiscoveryCardList(recipes)}  </CardDeck> : null}
        </div>
    )
}

