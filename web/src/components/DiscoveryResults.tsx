import React from 'react'
import { DiscoveryCard } from './DiscoveryCard'
import CardDeck from 'react-bootstrap/CardDeck'
import { Recipe } from 'lib/interfaces';
import discoverStyles from '../styles/Discover.module.css';


interface Props {
    recipes: Recipe[] | Error | undefined
    hasSearched: boolean
}


export const DiscoveryResults: React.FC<Props> = ({ recipes, hasSearched }) => {
    const DiscoveryCardList = (recipes: Recipe[]) => recipes.map(r => <DiscoveryCard key={r.id} recipe={r} />)

    return (
        <div>
            {hasSearched && recipes === null ? <div className={discoverStyles.header}><h5>No Results Found</h5> <h6>Try refreshing the page and performing a new search</h6></div>:
                Array.isArray(recipes) && recipes.length > 0 ? <CardDeck id="cardDeck" style={{justifyContent: "space-around"}}> {DiscoveryCardList(recipes)}  </CardDeck> : null}
        </div>
    )
}

