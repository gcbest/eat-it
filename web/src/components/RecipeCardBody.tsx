import React, { Fragment } from 'react'
import Card from 'react-bootstrap/Card'
import { Recipe, CustomToggleInterface, CartItemInterface, User } from 'lib/interfaces'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import ListGroup from 'react-bootstrap/ListGroup'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle'
import { createMarkup, convertToJSON } from 'lib/utils'
import { ADD_CART_ITEM, GET_CART_ITEMS_BY_USER_ID, ADD_MANY_CART_ITEMS } from 'graphql/queriesAndMutations'
import { useMutation } from '@apollo/react-hooks'

interface Props {
    recipe: Recipe
    me: User
}

const RecipeCardBody: React.FC<Props> = ({ recipe, me, children }) => {
    const { title, readyInMinutes, servings, image, summary, analyzedInstructions, extendedIngredients, sourceUrl } = recipe

    const imgUrlBase = 'https://spoonacular.com/cdn/ingredients_100x100/'

    const [addCartItem] = useMutation(ADD_CART_ITEM, {
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    const [addManyCartItems] = useMutation(ADD_MANY_CART_ITEMS, {
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })
    
    // TODO: see if we need this 
    const CustomToggle = ({ children, eventKey }: CustomToggleInterface) => {
        const decoratedOnClick = useAccordionToggle(eventKey, () =>
            console.log('totally custom!'),
        );

        return (<Button variant="secondary" onClick={decoratedOnClick}>{children}</Button>);
    }

    const convertIngredientToItem = (ingredient: any): CartItemInterface => {
        const {name, amount, unit, image} = ingredient
        const img = `${imgUrlBase}${image}`
        const item = {name, amount: parseFloat(amount), unit, img, aisle: 0, isChecked: false, isCleared: false, userId: me.id}
        return item;
    }

    const handleAddIngredient = (ingredient: any) => {
        const item = convertIngredientToItem(ingredient)
        addCartItem({
            variables: {item}
        })
    }

    const handleAddAllIngredients = (ingredientsArr: [any]) => {
        const items = ingredientsArr.map(convertIngredientToItem)
        debugger
        addManyCartItems({
            variables: {items}
        })
    }

    return (
        <Fragment>

            <Card.Img variant="top" src={image} style={{width: '100%'}}/>
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

                {extendedIngredients ?
                    <Accordion>
                        <Card border="secondary">
                            <Card.Header>
                                <CustomToggle eventKey="0">Expand Ingredients</CustomToggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <h3>Click on an item to add to shopping cart</h3>
                                    <Button onClick={() => handleAddAllIngredients(JSON.parse(extendedIngredients))} variant="primary">Add all ingredients to cart</Button>
                                    <ListGroup>
                                        {JSON.parse(extendedIngredients).map((extIng: any) => {
                                            return (<ListGroup.Item key={extIng.id} onClick={() => handleAddIngredient(extIng)}> <img src={`${imgUrlBase}${extIng.image}`} alt={extIng.name} /> {extIng.name} | {extIng.originalString} </ListGroup.Item>)
                                        })}
                                    </ListGroup>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                    : null
                }
                {/* <a href={sourceUrl} target="_blank" rel="noopener noreferrer"><Button variant="primary" style={{ marginTop: '3rem' }}>View Recipe</Button></a>
                <Button variant="secondary" style={{ margin: '3rem' }} onClick={handleShow}>Add Recipe</Button> */}
                
                {children}
            </Card.Body>
        </Fragment>
    )
}

export default RecipeCardBody
