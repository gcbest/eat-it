import React, { useState, useRef, useEffect, useCallback } from 'react'
import { DiscoveryResults } from 'components/DiscoveryResults'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { spoonacular } from '../lib/api'
import { AxiosResponse } from 'axios'
import hasIn from '@bit/lodash.lodash.has-in'
import { Recipe } from 'lib/interfaces'
import { QueryResult } from '@apollo/react-common';

import { useRandomRecipesQuery } from "../generated/graphql";




export const Discover: React.FC = () => {
    // const [recipes, setRecipes] = useState<Recipe[] | Error | AxiosResponse | undefined>(undefined)
    // const [recipes, setRecipes] = useState<Object[] | Error | AxiosResponse | undefined>(undefined)
    const [recipes, setRecipes] = useState<QueryResult | undefined>(undefined)
    const queryRef = useRef<HTMLInputElement>(null);

    const memoizedCallback = useCallback(
        () => {
            if (queryRef !== null && queryRef.current !== null) {

                const recipeResults = useRandomRecipesQuery({
                    variables: {
                        tags: queryRef.current.value,
                        number: 1
                    }
                })
                setRecipes(recipeResults)
            }
        },
        [],
    );

    const handleSearch = async () => {
        try {
            if (queryRef !== null && queryRef.current !== null) {
                // const results = await spoonacular.random({ tags: queryRef.current.value, number: 2 })
                // const { data: { recipes: recipeResults } } = results;
                //debugger;

                const recipeResults = useRandomRecipesQuery({
                    variables: {
                        tags: queryRef.current.value,
                        number: 1
                    }
                })
                setRecipes(recipeResults)
            }
        } catch (error) {
            //debugger;
            setRecipes(undefined);
            console.error(error);
        }

    }

    // const handleChange = (e: React.FormEvent<FormControl & HTMLInputElement>) => {
    //     setQuery(e.currentTarget.value)
    // }

    return (
        <Container>
            <Row>
                <Col>
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
                    <DiscoveryResults recipes={recipes} />
                    {/* <DiscoveryResults /> */}
                    {/* </QueryContext.Provider> */}
                </Col>
            </Row>
        </Container>
    )
}

