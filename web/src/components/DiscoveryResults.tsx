import React from 'react'
import { DiscoveryCard } from './DiscoveryCard'
import CardDeck from 'react-bootstrap/CardDeck'
import { Recipe } from 'lib/interfaces';

interface Props {
    recipes: Recipe[] | Error | undefined
    hasSearched: boolean
}


export const DiscoveryResults: React.FC<Props> = ({ recipes, hasSearched }) => {
    const DiscoveryCardList = (recipes: Recipe[]) => recipes.map(r => <DiscoveryCard key={r.id} recipe={r} />)

    return (
        <div>
            {hasSearched && recipes === null ? <h5>No Results Found</h5>:
                Array.isArray(recipes) && recipes.length > 0 ? <CardDeck id="cardDeck" style={{justifyContent: "space-around"}}> {DiscoveryCardList(recipes)}  </CardDeck> : null}
        </div>
    )
}

