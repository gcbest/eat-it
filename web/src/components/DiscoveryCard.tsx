import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Accordion from 'react-bootstrap/Accordion'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';

import { Recipe, CustomToggleInterface } from 'lib/interfaces'


interface Props<T> {
    recipe: T;
}




// interface Props { }

// export const DiscoveryCard: React.FC<Props<Recipe>> = ({ recipe }) => {
export const DiscoveryCard: React.FC<Props<any>> = ({ recipe }) => {
    const { title, readyInMinutes, servings, image, summary, analyzedInstructions, sourceUrl } = recipe

    function CustomToggle({ children, eventKey }: CustomToggleInterface) {
        const decoratedOnClick = useAccordionToggle(eventKey, () =>
            console.log('totally custom!'),
        );

        return (<Button variant="secondary" onClick={decoratedOnClick}>{children}</Button>);
    }

    function createMarkup(markup: string): { __html: string } {
        // function createMarkup(): { __html: string } {
        return ({ __html: markup });
        // return { __html: 'First &middot; Second' };
    }


    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={image} />
            <Card.Body style={{ maxHeight: '8rem', overflowY: "scroll" }}>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Servings: {servings}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">Ready in: {readyInMinutes} mins</Card.Subtitle>
                <Card.Text>
                    {<span dangerouslySetInnerHTML={createMarkup(summary)}></span>}
                </Card.Text>

                {Array.isArray(analyzedInstructions) && analyzedInstructions.length > 0 ?
                    <Accordion>
                        <Card border="primary">
                            <Card.Header>
                                <CustomToggle eventKey="0">Expand Instructions</CustomToggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    {/* <ListGroup variant="flush"> */}
                                    <ListGroup>
                                        {analyzedInstructions[0].steps.map((s: any) => <ListGroup.Item > {s.number}. {s.step}</ListGroup.Item>)}
                                    </ListGroup>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                    : null
                }
                <a href={sourceUrl} target="_blank"><Button variant="primary" style={{ marginTop: '3rem' }}>View Recipe</Button></a>
            </Card.Body>
        </Card >
    )
}

