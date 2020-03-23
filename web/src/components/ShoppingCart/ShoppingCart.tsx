import React, { useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { ShoppingCartInterface, CartItemInterface } from 'lib/interfaces'
import CartItem from './CartItem'



const ShoppingCart:React.FC<ShoppingCartInterface> = ({items}) => {
    const [itemsToComplete, setItemsToComplete] = useState<CartItemInterface[]>([])
    const [completedItems, setCompletedItems] = useState<CartItemInterface[]>([])

    if(items && items.length > 0) {
        const toComplete: CartItemInterface[] = []
        const completed: CartItemInterface[] = []
        items.forEach(item => {
            item.isChecked ? completed.push(item) : toComplete.push(item)
        })
        setItemsToComplete(toComplete)
        setCompletedItems(completed)
    }

    return (
        <ListGroup>
            <h1>Shopping Cart</h1>
            {/* Unchecked Section */}
            <h3>Items to Get</h3>
            {itemsToComplete.map(item => {
                <CartItem item={item}/>
            })}

            {/* Already Checked Selection */}
            <h3>Items already Got</h3>
            {completedItems.map(item => {
                <CartItem item={item}/>
            })}
            <h3>No Items in Cart</h3>
        </ListGroup>
    )
}

export default ShoppingCart
