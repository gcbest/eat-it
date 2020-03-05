import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form';
import { RecipeSlim } from 'lib/interfaces';
import { MealItem } from './MealItem';

interface Props {
    header: string
    recipesSlim: RecipeSlim[]
}

export const MealCard: React.FC<Props> = ({ header, recipesSlim, }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<RecipeSlim[]>([])

    const handleFilter = (e: any) => {
        setSearchTerm(e.target.value)
    }

    useEffect(() => {
        const results: RecipeSlim[] = recipesSlim.filter(rs => searchTerm === '' || rs.title.toLowerCase().trim().includes(searchTerm.toLowerCase()))
        setSearchResults(results)
    }, [searchTerm])


    return (
        <Card>
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
                        searchResults.map(rcpSlm => <MealItem key={rcpSlm.id} image={rcpSlm.image} title={rcpSlm.title} />)}
                </ListGroup>
            </Card.Body>
            <Card.Footer>
                <Button>Add New</Button>
            </Card.Footer>
        </Card>
    )
}
