import React, { useState, useRef, useEffect } from 'react'
import gql from 'graphql-tag';
import { DiscoveryResults } from 'components/DiscoveryResults'
import { SpinnerComponent } from 'components/Spinner'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';
import { useLazyQuery } from '@apollo/react-hooks'
import { useMeQuery } from 'generated/graphql';
import Form from 'react-bootstrap/Form';
import discoverStyles from '../styles/Discover.module.css'
import { Redirect } from 'react-router-dom';

export const DiscoverContext = React.createContext<any>(undefined)

const Discover: React.FC = () => {
    const queryRef = useRef<HTMLInputElement>(null);
    const [height, setHeight] = useState('100vh')

    const { data: user, loading: loadingUser } = useMeQuery();

    const [hasSearched, setHasSearched] = useState(false)

    const [getRandomRecipes, { loading: loadingRandomRecipes, data }] = useLazyQuery(gql`
        query randomRecipes($tags: String!, $number: Float!) {
        randomRecipes(tags: $tags, number: $number) {
            id
            title
            readyInMinutes
            servings
            image
            summary
            sourceUrl
            extendedIngredients
            analyzedInstructions
            dishTypes
        }
        }
    `);

    const randomRecipes = data && data.randomRecipes

    useEffect(() => {
        const cardDeck = document.getElementById('cardDeck');
        if (cardDeck && cardDeck.hasChildNodes() && window.innerWidth < 992)
            setHeight('auto') // make background expand to fit newly added cards

        if (queryRef && queryRef.current)
            queryRef.current.focus()
    }, [randomRecipes])

    const handleSearch = (e: any) => {
        e.preventDefault()
        setHasSearched(true)
        try {
            if (queryRef !== null && queryRef.current !== null) {
                getRandomRecipes({
                    variables: {
                        tags: queryRef.current.value.toLowerCase(),
                        number: 3
                    }
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    if (loadingUser)
        return <SpinnerComponent />;

    if (!user)
        return <Redirect to="/login" push={true} /> 


    return (
        <div className={discoverStyles.background} style={{ position: 'relative', height }}>
            <Container>
                <DiscoverContext.Provider value={{ me: user ? user.me : null }}>
                    <Form>
                        <Form.Group>
                            <Form.Label>
                                <h2 className={discoverStyles.header}>Find New Recipes!</h2>
                            </Form.Label>
                            <InputGroup className="mb-3">
                                <FormControl
                                    type="input"
                                    placeholder="e.g. shrimp"
                                    aria-label="recipe"
                                    aria-describedby="basic-addon2"
                                    ref={queryRef as any} // react-bootstrap TS bug
                                />
                                <InputGroup.Append>
                                    <Button variant="secondary" type="submit" onClick={handleSearch}>Discover</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                    </Form>
                    {
                        loadingRandomRecipes ?
                            <SpinnerComponent /> :
                            <DiscoveryResults recipes={data && data.randomRecipes ? data.randomRecipes : null} hasSearched={hasSearched} />
                    }
                </DiscoverContext.Provider>
            </Container>
        </div>
    )
}

export default Discover