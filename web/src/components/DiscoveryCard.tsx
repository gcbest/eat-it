import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'


interface Props<T> {
    recipe: T;
}

interface Recipe {
    title: string;
}
// export const DiscoveryCard: React.FC<Props> = ({ title, description, link }) => {
export const DiscoveryCard: React.FC<Props<Recipe>> = ({ recipe }) => {
    const { title } = recipe
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                {/* <Card.Title>Card Title</Card.Title> */}
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                    Description
                    {/* {description} */}
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
            </Card.Body>
        </Card>
    )
}

