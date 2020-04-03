import React, { useState, useRef, useEffect } from 'react'
import gql from 'graphql-tag';
import { DiscoveryResults } from 'components/DiscoveryResults'
import { SpinnerComponent } from 'components/Spinner'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import hasIn from '@bit/lodash.lodash.has-in'
import { Recipe } from 'lib/interfaces'
import { useLazyQuery } from '@apollo/react-hooks'
import { ModalInterface } from '../lib/interfaces'
import { useAddRecipeMutation, AddRecipeInput, useMeLocalQuery, useMeLocalLazyQuery } from 'generated/graphql';
import Form from 'react-bootstrap/Form';
import discoverStyles from '../styles/Discover.module.css'

export const DiscoverContext = React.createContext<any>(undefined)

const Discover: React.FC = () => {
    const queryRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(queryRef && queryRef.current)
            queryRef.current.focus()
    }, [])
    
    const [hasSearched, setHasSearched] = useState(false)
    const { data: user, loading: loadingLocal } = useMeLocalQuery()



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
            extendedIngredients
            analyzedInstructions
            dishTypes
        }
        }
    `);

    // const [getMeLocal, { data: dataLocal, loading: loadingLocal }] = useMeLocalLazyQuery()
    // const { data: dataLocal, loading: loadingLocal } = useMeLocalQuery()

    // if (loadingLocal)
    //     console.log('loading local');

    // if (dataLocal)
    //     console.log(dataLocal);

    const [addRecipe] = useAddRecipeMutation()

    const handleSearch = (e: any) => {
        e.preventDefault()
        setHasSearched(true)
        try {
            if (queryRef !== null && queryRef.current !== null) {
                getRandomRecipes({
                    variables: {
                        tags: queryRef.current.value.toLowerCase(),
                        number: 1
                    }
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    
    return (
        <div className={discoverStyles.background}>
        <Container>
        <DiscoverContext.Provider value={{ me: user ? user.me : null }}>
            <Form>
                <Form.Group>
                    <Form.Label>
                        <h2>Find New Recipes!</h2>
                    </Form.Label>
                <InputGroup className="mb-3">
                    <FormControl
                        type="input"
                        placeholder="e.g. scallops"
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
                loading ?
                <SpinnerComponent /> :
                <DiscoveryResults recipes={data && data.randomRecipes ? data.randomRecipes : null} hasSearched={hasSearched} />
            }
        </DiscoverContext.Provider>
        </Container>
            </div>
    )
}

export default Discover