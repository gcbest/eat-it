import React, { Fragment } from 'react'
import Card from 'react-bootstrap/Card'
import { Recipe, CustomToggleInterface, CartItemInterface, User } from 'lib/interfaces'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import ListGroup from 'react-bootstrap/ListGroup'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle'
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { createMarkup, convertToJSON, capitalize } from 'lib/utils'
import { ADD_CART_ITEM, GET_CART_ITEMS_BY_USER_ID, ADD_MANY_CART_ITEMS } from 'graphql/queriesAndMutations'
import { useMutation } from '@apollo/react-hooks'
import classNames from 'classnames/bind'
import recipeCardBodyStyles from './RecipeCardBody.module.css'
import { useToasts } from 'react-toast-notifications'
import nanoid from 'nanoid'

const cx = classNames.bind(recipeCardBodyStyles)

interface Props {
    recipe: Recipe
    me: User
    handleShow?: () => void
}

const RecipeCardBody: React.FC<Props> = ({ recipe, me, handleShow, children }) => {
    const { title, readyInMinutes, servings, image, summary, analyzedInstructions, extendedIngredients } = recipe
    const isDiscoveryCard = handleShow ? true : false // function only passed from discovery cards
    let className = cx({
        cardImage: true,
        pointer: isDiscoveryCard
    })
    let ingImageStyles = cx({
        pointer: true,
        ingImage: true
    })

    const { addToast } = useToasts()

    const imgUrlBase = 'https://spoonacular.com/cdn/ingredients_100x100/'

    const [addCartItem] = useMutation(ADD_CART_ITEM, {
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    const [addManyCartItems] = useMutation(ADD_MANY_CART_ITEMS, {
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    const CustomToggle = ({ children, eventKey, variant }: CustomToggleInterface) => {
        const decoratedOnClick = useAccordionToggle(eventKey, () => null);
        return (<Button variant={variant} onClick={decoratedOnClick}>{children}</Button>);
    }

    const convertIngredientToItem = (ingredient: any): CartItemInterface => {
        const { name, amount, unit, image } = ingredient
        const img = `${imgUrlBase}${image}`
        const item = { name, amount: parseFloat(amount), unit, img, aisle: 0, isChecked: false, isCleared: false, userId: me.id }
        return item;
    }

    const handleAddIngredient = async (ingredient: any) => {
        const item = convertIngredientToItem(ingredient)
        const { errors, data } = await addCartItem({
            variables: { item }
        })
        if (errors)
            addToast(errors[0].message, { appearance: 'error' })
        if (data)
            addToast(`${capitalize(item.name)} Added to Cart`, { appearance: 'success' })


    }

    const handleAddAllIngredients = async (ingredientsArr: [any]) => {
        const items = ingredientsArr.map(convertIngredientToItem)
        const { errors, data } = await addManyCartItems({
            variables: { items }
        })

        if (errors)
            addToast(errors[0].message, { appearance: 'error' })
        if (data)
            addToast('All Items Added to Cart', { appearance: 'success' })
    }

    return (
        <Fragment>
            <LazyLoadImage
                className={className}
                effect="blur"
                alt={title}
                src={image}
                onClick={handleShow}
                width="100%" />
            <Card.Body style={{ maxHeight: '28vh', overflowY: "scroll" }}>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Servings: {servings}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">Ready in: {readyInMinutes} mins</Card.Subtitle>
                {children}
                <Card.Text>
                    {<span dangerouslySetInnerHTML={createMarkup(summary)}></span>}
                </Card.Text>

                {analyzedInstructions ?
                    <Accordion style={{ marginBottom: '1rem' }}>
                        <Card border="warning" style={{ border: '1px solid rgba(0, 0, 0, 0.125)', borderRadius: '0.4rem' }}>
                            <Card.Header>
                                <CustomToggle eventKey="0" variant='warning'>Expand Instructions</CustomToggle>
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
                        <Card border="info" style={{ border: '1px solid rgba(0, 0, 0, 0.125)', borderRadius: '0.4rem' }}>
                            <Card.Header>
                                <CustomToggle eventKey="0" variant='info'>Expand Ingredients</CustomToggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <h5>Click on Item to Add to Cart</h5>
                                    <Button style={{ margin: '1rem 0' }} onClick={() => handleAddAllIngredients(JSON.parse(extendedIngredients))} variant="primary">Add All to Cart</Button>
                                    <ListGroup>
                                        {JSON.parse(extendedIngredients).map((extIng: any) => {
                                            extIng.id = nanoid(6) // overwriting to prevent duplicate keys in shopping cart
                                            return (
                                                <ListGroup.Item key={extIng.id} onClick={() => handleAddIngredient(extIng)} className={recipeCardBodyStyles.ingContainer}>
                                                    <img src={`${imgUrlBase}${extIng.image}`} alt={extIng.name} className={ingImageStyles} />  <p className={recipeCardBodyStyles.itemDesc}>{extIng.originalString}</p>
                                                </ListGroup.Item>)
                                        })}
                                    </ListGroup>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                    : null
                }
            </Card.Body>
        </Fragment>
    )
}

export default RecipeCardBody
