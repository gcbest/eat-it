import React, { useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { ShoppingCartInterface, CartItemInterface } from 'lib/interfaces'
import CartItem from './CartItem'
import AddCartItem from './AddCartItem'

const ShoppingCart: React.FC<ShoppingCartInterface> = ({ items }) => {
    const [itemsToComplete, setItemsToComplete] = useState<CartItemInterface[]>([])
    const [completedItems, setCompletedItems] = useState<CartItemInterface[]>([])
    const [newItem, setNewItem] = useState<CartItemInterface>({ name: '', amount: 0, isChecked: false })
    

    if (!items || items.length < 1) {
        return (
            <div>
                <h1>Shopping Cart</h1>
                <AddCartItem itemSuggestions={items}/>
                <h3>No Items in Cart</h3>
            </div>
        )
    }

    const toComplete: CartItemInterface[] = []
    const completed: CartItemInterface[] = []
    items.forEach(item => { item.isChecked ? completed.push(item) : toComplete.push(item) })
    setItemsToComplete(toComplete)
    setCompletedItems(completed)

    return (
        <ListGroup>
            <h1>Shopping Cart</h1>
            <AddCartItem itemSuggestions={items}/>

            {/* Unchecked Section */}
            <h3>Items to Get</h3>
            {itemsToComplete.map(item => <CartItem item={item} />)}

            {/* Already Checked Selection */}
            <h3>Items already Got</h3>

            {completedItems.map(item => <CartItem item={item} />)}
        </ListGroup>
    )
}

export default ShoppingCart
