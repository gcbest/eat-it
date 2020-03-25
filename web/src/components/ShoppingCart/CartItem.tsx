import React, { useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import { GET_CART_ITEMS_BY_USER_ID, UPDATE_CART_ITEM_BY_ID, TOGGLE_CART_ITEM_CHECKED_BY_ID, DELETE_CART_ITEM } from 'graphql/queriesAndMutations'
import { useMutation } from '@apollo/react-hooks'
import { CartItemInterface, User } from 'lib/interfaces'
import ingredientPlaceholder from '../../assets/images/ingredients_placeholder.png'
import Button from 'react-bootstrap/Button'
import './CartItem.css'

interface Props {
    item: CartItemInterface
    me: User
}

const CartItem: React.FC<Props> = ({ me, item }) => {
    const {id, name, aisle, amount, units, img, isChecked} = item
    const [isEditable, setIsEditable] = useState(false)
    const [updateCartItem] = useMutation(UPDATE_CART_ITEM_BY_ID, {
        variables: {item: {...item, isChecked: !isChecked, userId: me.id}},
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    const [toggleCartItem] = useMutation(TOGGLE_CART_ITEM_CHECKED_BY_ID, {
        variables: {id, isChecked: !isChecked},
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    const [deleteCartItem] = useMutation(DELETE_CART_ITEM, {
        variables: {id},
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })


    

    const handleClick = () => {
        // updateCartItem()
        toggleCartItem()
    }

    const handleDelete = () => {
        if(window.confirm('Are you sure you want to delete item?'))
            deleteCartItem()
    }

    const handleEditClick = () => {
        setIsEditable(true)
    }

    return (
        <ListGroup.Item variant={isChecked ? 'dark' : 'light'}>
            <Form.Check
                type='checkbox'
                id={`${name}`}
                checked={isChecked}
            >
                {img ? <img src={img} alt={name} /> : <img onClick={handleClick} src={ingredientPlaceholder} alt={name} />}

                {   
                    isEditable ?
                    <Form.Control style={{width: 'fit-content'}} type="text" name="name" value={name}/> :
                    <span onClick={handleEditClick} className={isChecked ? 'completed' : ''}>{name}</span>
                }
                <span className={isChecked ? 'completed' : ''}>{amount}</span>
                <span className={isChecked ? 'completed' : ''}>{units}</span>
                <span className={isChecked ? 'completed' : ''}>Aisle <Badge variant="primary">{aisle}</Badge></span>
                <Button variant="danger" onClick={handleDelete}>X</Button>
            </Form.Check>
        </ListGroup.Item>
    )
}
export default CartItem
