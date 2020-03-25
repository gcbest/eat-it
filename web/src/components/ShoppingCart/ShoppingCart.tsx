import React, { useState, useEffect, useContext } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { ShoppingCartInterface, CartItemInterface } from 'lib/interfaces'
import CartItem from './CartItem'
import AddCartItem from './AddCartItem'
import { ProfileContext } from 'pages/Profile'



const ShoppingCart: React.FC<ShoppingCartInterface> = ({ items }) => {
    const { me } = useContext(ProfileContext)
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
                <AddCartItem itemSuggestions={items} me={me}/>
                <h3>No Items in Cart</h3>
            </div>
        )
    }

    return (
        <ListGroup>
            <h1>Shopping Cart</h1>
            <AddCartItem itemSuggestions={items} me={me}/>

            {/* Unchecked Section */}
            <h3>Items to Get</h3>
            {itemsToComplete.map(item => <CartItem key={item.id} me={me} item={item} />)}

            {/* Already Checked Selection */}
            <h3>Items already Got</h3>

            {completedItems.map(item => <CartItem key={item.id} me={me} item={item} />)}
        </ListGroup>
    )
}

export default ShoppingCart
