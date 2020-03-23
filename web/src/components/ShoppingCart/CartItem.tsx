import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import { CartItemInterface } from 'lib/interfaces'
import ingredientPlaceholder from '../../assets/images/ingredients_placeholder.png'
import Badge from 'react-bootstrap/Badge'

interface Props {
    item: CartItemInterface
}

const CartItem: React.FC<Props> = ({ item: {name, aisle, amount, units, img, isChecked} }) =>
    (
        <ListGroup.Item>
            <Form.Check
                type='checkbox'
                id={`${name}`}
                checked={isChecked}
            >
                {img ? <img src={img} alt={name} /> : <img src={ingredientPlaceholder} alt={name} />}
                <span>{name}</span>
                <span>{amount}</span>
                <span>{units}</span>
                <span>Aisle <Badge>{aisle}</Badge></span>
            </Form.Check>
        </ListGroup.Item>
    )

export default CartItem
