import React, { useState } from 'react'
import { DiscoveryResults } from 'components/DiscoveryResults'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import { spoonacular } from '../lib/api'

// export const QueryContext = React.createContext();

export const Discover: React.FC = () => {
    const [query, setQuery] = useState('')
    const [recipes, setRecipes] = useState([])

    const handleSearch = async () => {
        try {
            const results = await spoonacular.random({ tags: query, number: 3 })
            setRecipes(results)
        } catch (error) {
            console.error(error);
        }

    }

    const handleChange = (e: React.FormEvent<FormControl & HTMLInputElement>) => setQuery(e.currentTarget.value)

    return (
        <div>
            {/* <QueryContext.Provider value={''}> */}
            <InputGroup className="mb-3">
                <FormControl
                    type="input"
                    placeholder="Recipient's username"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    onChange={handleChange}
                />
                <InputGroup.Append>
                    <Button variant="outline-secondary" onClick={handleSearch}>Discover</Button>
                </InputGroup.Append>
            </InputGroup>
            <DiscoveryResults recipes={recipes} />
            {/* </QueryContext.Provider> */}
        </div>
    )
}

