import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import gql from 'graphql-tag';
import { DiscoveryResults } from 'components/DiscoveryResults'
import { SpinnerComponent } from 'components/Spinner'
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
import { useLazyQuery } from '@apollo/react-hooks';
import { QueryResult } from '@apollo/react-common';


export const Discover: React.FC = () => {
    // const [recipes, setRecipes] = useState<Recipe[] | Error | AxiosResponse | undefined>(undefined)
    // const [recipes, setRecipes] = useState<Object[] | Error | AxiosResponse | undefined>(undefined)
    // const [recipes, setRecipes] = useState<QueryResult | undefined>(undefined)
    const [recipes, setRecipes] = useState<any>(undefined)
    const queryRef = useRef<HTMLInputElement>(null);

    // const memoizedCallback = useCallback(
    //     () => {
    //         if (queryRef !== null && queryRef.current !== null) {

    //             const recipeResults = useRandomRecipesQuery({
    //                 variables: {
    //                     tags: queryRef.current.value,
    //                     number: 1
    //                 }
    //             })
    //             setRecipes(recipeResults)
    //         }
    //     },
    //     [],
    // );

    const [getRandomRecipes, { loading, data }] = useLazyQuery(gql`
        query randomRecipes($tags: String!, $number: Float!) {
        randomRecipes(tags: $tags, number: $number) {
            id
            title
            readyInMinutes
            servings
            image
            summary
            sourceUrl
            analyzedInstructions
        }
        }
    `);


    const handleSearch = async () => {
        try {
            if (queryRef !== null && queryRef.current !== null) {
                // const results = await spoonacular.random({ tags: queryRef.current.value, number: 2 })
                // const { data: { recipes: recipeResults } } = results;
                //debugger;

                // setRecipes([x])

                getRandomRecipes({
                    variables: {
                        tags: queryRef.current.value,
                        number: 1
                    }
                })
                // debugger;
                // setRecipes(data && data.randomRecipes ? data.randomRecipes : undefined)
            }
        } catch (error) {
            //debugger;
            setRecipes(undefined);
            console.error(error);
        }

    }

    // useEffect(() => {
    //     setRecipes(data && data.randomRecipes ? data.randomRecipes : undefined)
    // }, [recipes])

    // const handleChange = (e: React.FormEvent<FormControl & HTMLInputElement>) => {
    //     setQuery(e.currentTarget.value)
    // }



    // debugger;
    // useMemo(() => {
    //     // if (data && data.randomRecipes) {
    //     setRecipes(data.randomRecipes);
    //     // }
    // }, [data])

    // if (data && data.randomRecipes) {
    //     setRecipes(data.randomRecipes)
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
                    </InputGroup> {
                        loading ?
                            <SpinnerComponent /> :
                            <DiscoveryResults recipes={data && data.randomRecipes ? data.randomRecipes : null} />
                    }
                    {/* <DiscoveryResults recipes={recipes} /> */}
                    {/* {recipes && <DiscoveryResults recipes={recipes} />} */}
                    {/* <DiscoveryResults /> */}
                    {/* </QueryContext.Provider> */}
                </Col>
            </Row>
        </Container>
    )
}

