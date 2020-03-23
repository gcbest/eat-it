import React from 'react'
import { ShoppingCartInterface } from 'lib/interfaces'



const ShoppingCart:React.FC<ShoppingCartInterface> = ({items}) => {
    
    return (
        <div>
            <h1>Shopping Cart</h1>
            {/* Unchecked Section */}
            <h3>Items to Get</h3>
            {items && items.map(item => {
                
            })}

            <h3>Items already Got</h3>

            {/* Else */}
            <h3>No Items in Cart</h3>
        </div>
    )
}

export default ShoppingCart
