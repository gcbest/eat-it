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



const ShoppingCart: React.FC<ShoppingCartInterface> = ({ items }) => {
    const { me } = useContext(ProfileContext)
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
            variables: {ids, isCleared: true},
        })
    }


    const handleFilter = (e: any) => {
        if(e.target.value === '')
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
            <Accordion defaultActiveKey="0">
                {/* <Accordion.Toggle as={Button} variant="link" eventKey="0"> */}
                <Accordion.Toggle eventKey="0">
                    <h3>Items to Get</h3> 
                </Accordion.Toggle>
                <Form.Label>Filter Items</Form.Label>
                <Form.Control style={{display: 'inline', width: '35%'}} onChange={handleFilter}></Form.Control>
                <Accordion.Collapse eventKey="0">
                    <ListGroup>
                        {filteredItems.map(item => <CartItem key={item.id} me={me} item={item} />)}
                    </ListGroup>

                </Accordion.Collapse>
            </Accordion>


            {/* Already Checked Selection */}
            <Accordion defaultActiveKey="1">
                {/* <Accordion.Toggle as={Button} variant="link" eventKey="1"> */}
                <Accordion.Toggle eventKey="1">
                    <h3>Items already Got</h3> 
                </Accordion.Toggle>
                <Button onClick={() => handleClearItems(completedItems)}>Clear Items</Button>
                <Accordion.Collapse eventKey="1">
                    <ListGroup>
                        {completedItems.map(item => <CartItem key={item.id} me={me} item={item} />)}
                    </ListGroup>
                </Accordion.Collapse>
            </Accordion>


        </div >
    )
}

export default ShoppingCart
