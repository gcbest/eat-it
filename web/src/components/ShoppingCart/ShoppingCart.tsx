import React, { useState, useEffect, useContext } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { ShoppingCartInterface, CartItemInterface } from 'lib/interfaces'
import CartItem from './CartItem'
import AddCartItem from './AddCartItem'
import { ProfileContext } from 'pages/Profile'
import Accordion from 'react-bootstrap/Accordion'



const ShoppingCart: React.FC<ShoppingCartInterface> = ({ items }) => {
    const { me } = useContext(ProfileContext)
    const [itemsToComplete, setItemsToComplete] = useState<CartItemInterface[]>([])
    const [completedItems, setCompletedItems] = useState<CartItemInterface[]>([])


    useEffect(() => {
        const toComplete: CartItemInterface[] = []
        const completed: CartItemInterface[] = []
        debugger
        items.filter(item => !item.isCleared).forEach(item => { item.isChecked ? completed.push(item) : toComplete.push(item) })
        setItemsToComplete(toComplete)
        setCompletedItems(completed)
    }, [items])

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
                <Accordion.Collapse eventKey="0">
                    <ListGroup>
                        {itemsToComplete.map(item => <CartItem key={item.id} me={me} item={item} />)}
                    </ListGroup>

                </Accordion.Collapse>
            </Accordion>


            {/* Already Checked Selection */}
            <Accordion defaultActiveKey="1">
                {/* <Accordion.Toggle as={Button} variant="link" eventKey="1"> */}
                <Accordion.Toggle eventKey="1">
                    <h3>Items already Got</h3>
                </Accordion.Toggle>
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
