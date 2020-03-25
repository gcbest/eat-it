import React, { useState, useEffect } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { ShoppingCartInterface, CartItemInterface } from 'lib/interfaces'
import CartItem from './CartItem'
import AddCartItem from './AddCartItem'


const ShoppingCart: React.FC<ShoppingCartInterface> = ({ items }) => {
    const [itemsToComplete, setItemsToComplete] = useState<CartItemInterface[]>([])
    const [completedItems, setCompletedItems] = useState<CartItemInterface[]>([])

    useEffect(() => {
        const toComplete: CartItemInterface[] = []
        const completed: CartItemInterface[] = []
        items.forEach(item => { item.isChecked ? completed.push(item) : toComplete.push(item) })
        setItemsToComplete(toComplete)
        setCompletedItems(completed)
    }, [items])

    if (!items || items.length < 1) {
        return (
            <div>
                <h1>Shopping Cart</h1>
                <AddCartItem itemSuggestions={items}/>
                <h3>No Items in Cart</h3>
            </div>
        )
    }

    return (
        <ListGroup>
            <h1>Shopping Cart</h1>
            <AddCartItem itemSuggestions={items}/>

            {/* Unchecked Section */}
            <h3>Items to Get</h3>
            {itemsToComplete.map(item => <CartItem key={item.id} item={item} />)}

            {/* Already Checked Selection */}
            <h3>Items already Got</h3>

            {completedItems.map(item => <CartItem key={item.id} item={item} />)}
        </ListGroup>
    )
}

export default ShoppingCart
