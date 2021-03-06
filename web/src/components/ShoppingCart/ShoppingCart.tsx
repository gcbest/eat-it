import React, { useState, useEffect, useContext } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { ShoppingCartInterface, CartItemInterface } from 'lib/interfaces'
import CartItem from './CartItem'
import AddCartItem from './AddCartItem'
import { ProfileContext } from 'pages/Profile'
import Accordion from 'react-bootstrap/Accordion'
import { useMutation } from '@apollo/react-hooks'
import { CLEAR_MULTIPLE_ITEMS_FROM_SHOPPING_LIST, GET_CART_ITEMS_BY_USER_ID } from 'graphql/queriesAndMutations'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import uniqWith from 'lodash.uniqwith'
import isEqual from 'lodash.isequal'
import shoppingCartStyles from './ShoppingCart.module.css'
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard'

const ShoppingCart: React.FC<ShoppingCartInterface> = ({ items }) => {
    const { me } = useContext(ProfileContext)
    const [itemsToComplete, setItemsToComplete] = useState<CartItemInterface[]>([])
    const [completedItems, setCompletedItems] = useState<CartItemInterface[]>([])
    const [filteredItems, setFilteredItems] = useState<CartItemInterface[]>([])
    const [itemSuggestions, setItemSuggestions] = useState<CartItemInterface[]>([])
    const [clearItems] = useMutation(CLEAR_MULTIPLE_ITEMS_FROM_SHOPPING_LIST, {
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    const compareSuggestions = (item1:CartItemInterface, item2:CartItemInterface) => {
        const {name, amount, unit, aisle} = item1
        const item1Only = {name, amount, unit, aisle}
        const {name: name2, amount: amount2, unit: unit2, aisle:aisle2} = item2
        const item2Only = {name: name2, amount: amount2, unit: unit2, aisle:aisle2}
        return isEqual(item1Only, item2Only)
    }

    useEffect(() => {
        const toComplete: CartItemInterface[] = []
        const completed: CartItemInterface[] = []
        const uniqueSuggestions = uniqWith(items, compareSuggestions)
        setItemSuggestions(uniqueSuggestions)
        items.filter(item => !item.isCleared).forEach(item => { item.isChecked ? completed.push(item) : toComplete.push(item) })
        setItemsToComplete(toComplete)
        setCompletedItems(completed)
        setFilteredItems(toComplete)
    }, [items])

    const handleClearItems = (itemsArr: CartItemInterface[]) => {
        const ids = itemsArr.map(item => item.id)
        clearItems({
            variables: { ids, isCleared: true },
        })
    }

    const handleFilter = (e: any) => {
        if (e.target.value === '')
            return setFilteredItems(itemsToComplete)

        const itemsLeft = itemsToComplete.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
        setFilteredItems(itemsLeft)
    }

    if (!items || items.length < 1) {
        return (
            <div>
                <AddCartItem itemSuggestions={itemSuggestions} me={me} />
                <h2 className={shoppingCartStyles.labels}>No Items in Cart</h2>
            </div>
        )
    }

    return (
        <div>
            <AddCartItem itemSuggestions={itemSuggestions} me={me} />
            <Row>
                <Col sm={12} md={12} lg={10}>
                    <CollapsibleCard defaultActiveKey="0">
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="light" eventKey="0" className={shoppingCartStyles.toggleBtn}>
                                <h3>Items to Get</h3>
                            </Accordion.Toggle>
                            <Form.Control className={shoppingCartStyles.filterInput} placeholder='Filter items' onChange={handleFilter}></Form.Control>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body className={shoppingCartStyles.itemsDisplay}>
                                <ListGroup>
                                    {filteredItems.length ? filteredItems.map(item => <CartItem key={item.id} me={me} item={item} />) : <h4>No items in list</h4>}
                                </ListGroup>
                            </Card.Body>
                        </Accordion.Collapse>
                    </CollapsibleCard>
                </Col>
            </Row>

            <Row>
                <Col sm={12} md={8} lg={10}>
                    <CollapsibleCard defaultActiveKey="1">
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="light" eventKey="1" className={shoppingCartStyles.toggleBtn}>
                                <h3>Items Completed</h3>
                            </Accordion.Toggle>
                            <Button onClick={() => handleClearItems(completedItems)} className={shoppingCartStyles.clearBtn}>Clear Items</Button>

                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body className={shoppingCartStyles.itemsDisplay}>
                                <ListGroup>
                                    {completedItems.length ? completedItems.map(item => <CartItem key={item.id} me={me} item={item} />) : <h4>No items in list</h4>}
                                </ListGroup>

                            </Card.Body>
                        </Accordion.Collapse>
                    </CollapsibleCard>
                </Col>
            </Row>

        </div >
    )
}

export default ShoppingCart
