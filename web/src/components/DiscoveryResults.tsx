import React, { useState, useContext } from 'react'
import { DiscoveryCard } from './DiscoveryCard'
import { QueryContext } from 'pages/Discover'


export const DiscoveryResults: React.FC = () => {
    //TODO: use context for search results
    const query = useContext(QueryContext)

    const [results, setResults] = useState([])

    return (
        <div>
            {
                // !loading && 
                results && results.map(r => {
                    <DiscoveryCard recipe={r} />
                })
            }
        </div>
    )
}

