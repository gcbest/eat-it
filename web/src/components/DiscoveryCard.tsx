import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Accordion from 'react-bootstrap/Accordion'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';

import { Recipe, CustomToggleInterface, Instructions } from 'lib/interfaces'


interface Props<T> {
    recipe: T;
}

export const DiscoveryCard: React.FC<Props<Recipe>> = ({ recipe }) => {
    const { title, readyInMinutes, servings, image, summary, analyzedInstructions, sourceUrl } = recipe

    function CustomToggle({ children, eventKey }: CustomToggleInterface) {
        const decoratedOnClick = useAccordionToggle(eventKey, () =>
            console.log('totally custom!'),
        );

        return (<Button variant="secondary" onClick={decoratedOnClick}>{children}</Button>);
    }

    function createMarkup(markup: string): { __html: string } {
        return ({ __html: markup });
    }

    const convertToJSON = (stringifiedContent: string): Instructions => JSON.parse(stringifiedContent)

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

                {analyzedInstructions ?
                    <Accordion>
                        <Card border="primary">
                            <Card.Header>
                                <CustomToggle eventKey="0">Expand Instructions</CustomToggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <ListGroup>
                                        {convertToJSON(analyzedInstructions)
                                            .steps.map((s: any) => {
                                                return (<ListGroup.Item key={s.number}>{s.number}. {s.step}</ListGroup.Item>)
                                            })}
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

