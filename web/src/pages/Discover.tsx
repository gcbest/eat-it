import React, { useState, useRef, useEffect } from 'react'
import { DiscoveryResults } from 'components/DiscoveryResults'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
// import FormControl from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { spoonacular } from '../lib/api'
import { AxiosResponse } from 'axios'
import hasIn from '@bit/lodash.lodash.has-in'

// export const QueryContext = React.createContext();

interface Recipe {
    title: string;
}

export const Discover: React.FC = () => {
    // const [query, setQuery] = useState('')
    const [recipes, setRecipes] = useState<Error | AxiosResponse | undefined>(undefined)
    const queryRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // let x = queryRef?.current?.value;

        // return () => {};
    }, [])

    const handleSearch = async () => {
        try {
            debugger;
            if (queryRef !== null && queryRef.current !== null) {
                const results = await spoonacular.random({ tags: queryRef.current.value, number: 2 })
                setRecipes(results)
            }
        } catch (error) {
            setRecipes(undefined);
            console.error(error);
        }

    }

    // const handleChange = (e: React.FormEvent<FormControl & HTMLInputElement>) => {
    //     setQuery(e.currentTarget.value)
    // }

    return (
        <div>
            <InputGroup className="mb-3">
                <FormControl
                    type="input"
                    placeholder="Recipient's username"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    ref={queryRef as any} // react-bootstrap TS bug
                />
                <InputGroup.Append>
                    <Button variant="outline-secondary" onClick={handleSearch}>Discover</Button>
                </InputGroup.Append>
            </InputGroup>
            {/* <DiscoveryResults recipes={recipes} /> */}
            <DiscoveryResults />
            {/* </QueryContext.Provider> */}
        </div>
    )
}

