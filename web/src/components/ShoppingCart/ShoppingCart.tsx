import React, { useState, useEffect, useContext } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { ShoppingCartInterface, CartItemInterface } from 'lib/interfaces'
import CartItem from './CartItem'
import AddCartItem from './AddCartItem'
import { ProfileContext } from 'pages/Profile'
import Accordion from 'react-bootstrap/Accordion'
import Collapse from 'react-bootstrap/Collapse'
import { useMutation } from '@apollo/react-hooks'
import { CLEAR_MULTIPLE_ITEMS_FROM_SHOPPING_LIST, GET_CART_ITEMS_BY_USER_ID } from 'graphql/queriesAndMutations'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import shoppingCartStyles from './ShoppingCart.module.css'



const ShoppingCart: React.FC<ShoppingCartInterface> = ({ items }) => {
    const { me } = useContext(ProfileContext)
    const [openToComplete, setOpenToComplete] = useState(true);
    const [openCompleted, setOpenCompleted] = useState(true);

    const [itemsToComplete, setItemsToComplete] = useState<CartItemInterface[]>([])
    const [completedItems, setCompletedItems] = useState<CartItemInterface[]>([])
    const [filteredItems, setFilteredItems] = useState<CartItemInterface[]>([])
    const [clearItems] = useMutation(CLEAR_MULTIPLE_ITEMS_FROM_SHOPPING_LIST, {
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    useEffect(() => {
        const toComplete: CartItemInterface[] = []
        const completed: CartItemInterface[] = []
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

        const itemsLeft = itemsToComplete.filter(item => item.name.includes(e.target.value))
        setFilteredItems(itemsLeft)
    }

    if (!items || items.length < 1) {
        return (
            <div>
                <h1>Shopping Cart</h1>
                <AddCartItem itemSuggestions={items} me={me} />
                <h3>No Items in Cart</h3>
            </div>
        )
    }


    return (
        <div>

            <h1>Shopping Cart</h1>
            <AddCartItem itemSuggestions={items} me={me} />

            {/* Unchecked Section */}
            <Row>
                <Col sm={12} md={12} lg={10}>
                    <Accordion defaultActiveKey="0" style={{ marginTop: '4rem' }}>
                        <Card style={{ border: '1px solid rgba(0,0,0,0.125)', borderRadius: '0.4rem' }}>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="light" eventKey="0">
                                    <h3>Items to Get</h3>
                                </Accordion.Toggle>
                                <Form.Control style={{ display: 'inline', width: '35%', marginLeft: '1.5rem' }} placeholder='Filter items' onChange={handleFilter}></Form.Control>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <ListGroup>
                                        {filteredItems.length ? filteredItems.map(item => <CartItem key={item.id} me={me} item={item} />) : <h4>No items in list</h4>}
                                    </ListGroup>

                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </Col>
            </Row>

            <Row>
                <Col sm={12} md={8} lg={10}>
                    <Accordion defaultActiveKey="1" style={{ marginTop: '4rem' }}>
                        <Card style={{ border: '1px solid rgba(0,0,0,0.125)', borderRadius: '0.4rem' }}>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="light" eventKey="1">
                                    <h3>Items Completed</h3>
                                </Accordion.Toggle>
                                <Button onClick={() => handleClearItems(completedItems)} style={{ marginLeft: '1.5rem' }}>Clear Items</Button>

                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <ListGroup>
                                        {completedItems.length ? completedItems.map(item => <CartItem key={item.id} me={me} item={item} />) : <h4>No items in list</h4>}
                                    </ListGroup>

                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </Col>
            </Row>

        </div >
    )
}

export default ShoppingCart
