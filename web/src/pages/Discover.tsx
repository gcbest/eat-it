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
import hasIn from '@bit/lodash.lodash.has-in'
import { Recipe } from 'lib/interfaces'
import { useLazyQuery } from '@apollo/react-hooks'
import { EditModal } from 'components/EditModal'
import { ModalInterface } from '../lib/interfaces'
import { ModalType } from '../lib/enums'



export const ModalContext = React.createContext<Partial<ModalInterface>>({})

export const Discover: React.FC = () => {
    // const [recipes, setRecipes] = useState<any>(undefined)
    const queryRef = useRef<HTMLInputElement>(null);

    const [show, setShow] = useState(false);
    const [modalInfo, setModalInfo] = useState<Recipe | null>(null)


    const handleClose = () => setShow(false);
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


    const handleSearch = async () => {
        try {
            if (queryRef !== null && queryRef.current !== null) {
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
            // setRecipes(undefined);
            console.error(error);
        }

    }

    return (
        <Container>
            <Row>
                <Col>
                    <EditModal show={show} handleClose={handleClose} type={ModalType.New} data={modalInfo} />
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
                                <DiscoveryResults recipes={data && data.randomRecipes ? data.randomRecipes : null} />
                            </ModalContext.Provider>
                    }
                </Col>
            </Row>
        </Container>
    )
}

