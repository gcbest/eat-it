import React, { useState, useRef } from 'react'
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
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { EditModal } from 'components/EditModal'
import { ModalInterface } from '../lib/interfaces'
import { ModalCategory } from '../lib/enums'
import { useAddRecipeMutation, AddRecipeInput, useMeLocalQuery, useMeLocalLazyQuery } from 'generated/graphql';



export const ModalContext = React.createContext<Partial<ModalInterface>>({})

export const Discover: React.FC = () => {
    const queryRef = useRef<HTMLInputElement>(null);

    const [show, setShow] = useState(false);
    const [modalInfo, setModalInfo] = useState<Recipe | AddRecipeInput | any>(null)
    const [hasSearched, setHasSearched] = useState(false)

    const handleClose = (isSaved: boolean) => {
        if (isSaved && modalInfo) {
            const formattedRecipe = { ...modalInfo }
            formattedRecipe.userId = dataLocal!.me!.id
            // remove properties not needed by mutation
            delete formattedRecipe.id
            delete formattedRecipe.__typename
            // getMeLocal()
            console.log(`ME LOCAL: ${dataLocal}`);


            addRecipe({
                variables: {
                    recipe: formattedRecipe
                }
            })
        }


        setShow(false)
    }


    const handleShow = (recipe: Recipe) => {
        setModalInfo(recipe)
        setShow(true)
    }

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

    // const [getMeLocal, { data: dataLocal, loading: loadingLocal }] = useMeLocalLazyQuery()
    const { data: dataLocal, loading: loadingLocal } = useMeLocalQuery()

    if (loadingLocal)
        console.log('loading local');

    if (dataLocal)
        console.log(dataLocal);



    const [addRecipe] = useAddRecipeMutation()

    const handleSearch = async () => {
        setHasSearched(true)
        try {
            if (queryRef !== null && queryRef.current !== null) {
                getRandomRecipes({
                    variables: {
                        tags: queryRef.current.value,
                        number: 1
                    }
                })
            }
        } catch (error) {
            console.error(error)
        }

    }

    return (
        <Container>
            <Row>
                <Col>
                    <EditModal show={show} handleClose={handleClose} type={ModalCategory.New} data={modalInfo} />
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
                            <ModalContext.Provider value={{ show, handleClose, handleShow }}>
                                <DiscoveryResults recipes={data && data.randomRecipes ? data.randomRecipes : null} hasSearched={hasSearched} />
                            </ModalContext.Provider>
                    }
                </Col>
            </Row>
        </Container>
    )
}

