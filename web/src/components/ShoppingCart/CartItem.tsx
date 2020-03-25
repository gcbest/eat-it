import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import { GET_CART_ITEMS_BY_USER_ID, UPDATE_CART_ITEM_BY_ID } from 'graphql/queriesAndMutations'
import { useMutation } from '@apollo/react-hooks'
import { CartItemInterface, User } from 'lib/interfaces'
import ingredientPlaceholder from '../../assets/images/ingredients_placeholder.png'

interface Props {
    item: CartItemInterface
    me: User
}

const CartItem: React.FC<Props> = ({ me, item }) => {
    const {name, aisle, amount, units, img, isChecked} = item
    const [updateCartItem] = useMutation(UPDATE_CART_ITEM_BY_ID, {
        variables: {item: {...item, isChecked: !isChecked, userId: me.id}},
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    const handleClick = () => {
        updateCartItem()
    }

    return (
        <ListGroup.Item onClick={handleClick}>
            <Form.Check
                type='checkbox'
                id={`${name}`}
                checked={isChecked}
            >
                {img ? <img src={img} alt={name} /> : <img src={ingredientPlaceholder} alt={name} />}
                <span>{name}</span>
                <span>{amount}</span>
                <span>{units}</span>
                <span>Aisle <Badge variant="primary">{aisle}</Badge></span>
            </Form.Check>
        </ListGroup.Item>
    )
}
export default CartItem
