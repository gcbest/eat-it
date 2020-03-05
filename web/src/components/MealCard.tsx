import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form';
import useForm from 'lib/useForm';
// import { MealCategory } from 'lib/enums';
import { RecipeSlim } from 'lib/interfaces';
import { MealItem } from './MealItem';

interface Props {
    header: string
    recipesSlim: RecipeSlim[]
}

export const MealCard: React.FC<Props> = ({ header, recipesSlim, }) => {
    const { inputs, handleChange } = useForm({
        filter: 1
    });

    return (
        <Card>
            <Card.Header>Breakfast</Card.Header>
            <Card.Body>
                <Card.Title>
                    <Form>
                        <Form.Group controlId={`${header}-filter`}>
                            <Form.Control name={`${header}-filter`} value={inputs.filter} onChange={handleChange} placeholder='Filter Recipes'>

                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Card.Title>
                <ListGroup>
                    {/* {recipesSlim.map(rcpSlm => {
                        <MealItem />
                    })} */}

                </ListGroup>

            </Card.Body>
            <Card.Footer>
                <Button>Add New</Button>
            </Card.Footer>
        </Card>
    )
}
