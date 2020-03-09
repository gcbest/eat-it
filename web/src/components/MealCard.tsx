import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form';
import { RecipeSlim } from 'lib/interfaces';
import { MealItem } from './MealItem';
import { ModalCategory } from 'lib/enums';
import { CreateRecipeModal } from './CreateRecipeModal';

interface Props {
    header: string
    recipesSlim: RecipeSlim[]
    userId: number
}

export const MealCard: React.FC<Props> = ({ header, recipesSlim, userId }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [recipes, setRecipes] = useState<RecipeSlim[]>([])

    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<RecipeSlim[]>([])

    const handleFilter = (e: any) => {
        setSearchTerm(e.target.value)
    }



    useEffect(() => {

        const results: RecipeSlim[] = recipesSlim.filter(rs => searchTerm === '' || rs.title.toLowerCase().trim().includes(searchTerm.toLowerCase()))
        // setRecipes(results)
        setSearchResults(results)
    }, [searchTerm])

    const handleAddNew = () => {
        handleShow()
    }

    return (
        <Card>
            <CreateRecipeModal show={show} handleClose={handleClose} options={{ header }} />
            <Card.Header>{header}</Card.Header>
            <Card.Body>
                <Card.Title>
                    <Form>
                        <Form.Group controlId={`${header}Filter`}>
                            <Form.Control name={`${header}Query`} value={searchTerm} onChange={handleFilter} placeholder='Filter Recipes'>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Card.Title>
                <ListGroup>
                    {searchResults &&
                        searchResults.map(rcpSlm => <MealItem key={rcpSlm.id} image={rcpSlm.image} title={rcpSlm.title} id={rcpSlm.id} userId={userId} />)}
                </ListGroup>
            </Card.Body>
            <Card.Footer>
                <Button onClick={handleAddNew}>Add New</Button>
            </Card.Footer>
        </Card>
    )
}
