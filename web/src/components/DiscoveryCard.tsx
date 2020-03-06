import React, { useContext, useState } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Accordion from 'react-bootstrap/Accordion'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
// import { ModalContext } from '../pages/Discover'
import { ModalCategory } from '../lib/enums'
import { ViewRecipeModal } from 'components/ViewRecipeModal'

import { Recipe, CustomToggleInterface, Instructions } from 'lib/interfaces'

interface Props<T> {
    recipe: T;
}

export const DiscoveryCard: React.FC<Props<Recipe>> = ({ recipe }) => {
    const { title, readyInMinutes, servings, image, summary, analyzedInstructions, sourceUrl } = recipe
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const CustomToggle = ({ children, eventKey }: CustomToggleInterface) => {
        const decoratedOnClick = useAccordionToggle(eventKey, () =>
            console.log('totally custom!'),
        );

        return (<Button variant="secondary" onClick={decoratedOnClick}>{children}</Button>);
    }

    const createMarkup = (markup: string): { __html: string } => ({ __html: markup })

    const convertToJSON = (stringifiedContent: string): Instructions => JSON.parse(stringifiedContent)

    return (
        <Card style={{ width: '18rem' }}>
            <ViewRecipeModal show={show} handleClose={handleClose} options={{ type: ModalCategory.NewDiscover }} recipe={recipe} />

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
                <Button variant="secondary" style={{ margin: '3rem' }} onClick={handleShow}>Add Recipe</Button>
            </Card.Body>
        </Card >
    )
}

