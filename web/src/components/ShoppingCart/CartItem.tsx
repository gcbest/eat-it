import React, { useState, useReducer, useRef, useEffect } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import { GET_CART_ITEMS_BY_USER_ID, UPDATE_CART_ITEM_BY_ID, TOGGLE_CART_ITEM_CHECKED_BY_ID, CLEAR_ITEM_FROM_SHOPPING_LIST } from 'graphql/queriesAndMutations'
import { useMutation } from '@apollo/react-hooks'
import { CartItemInterface, User, CartItemEditables } from 'lib/interfaces'
import ingredientPlaceholder from '../../assets/images/ingredients_placeholder.png'
import Button from 'react-bootstrap/Button'
import './CartItem.css'
import { ItemDetails } from 'lib/enums'
import { getKeyByValue } from 'lib/utils'
import FormControl from 'react-bootstrap/FormControl'

interface Props {
    item: CartItemInterface
    me: User
}

const initialState: CartItemEditables = {
    name: false,
    amount: false,
    units: false,
    aisle: false,
}

const reducer = (state: CartItemEditables, action: any): CartItemEditables  => {
    const {type, value} = action
    switch(type) {
        case ItemDetails.name: 
            return {...state, name: value}
        case ItemDetails.amount: 
            return {...state, amount: value}
        case ItemDetails.units: 
            return {...state, units: value}
        case ItemDetails.aisle: 
            return {...state, aisle: value}
        default: 
            return state
    }
}

const CartItem: React.FC<Props> = ({ me, item }) => {
    const {id, name, aisle, amount, units, img, isChecked} = item
    const nameRef = useRef<FormControl<"input"> & HTMLInputElement>(null)
    const amountRef = useRef<FormControl<"input"> & HTMLInputElement>(null)
    const unitsRef = useRef<FormControl<"input"> & HTMLInputElement>(null)
    const aisleRef = useRef<FormControl<"input"> & HTMLInputElement>(null)
    const [isEditable, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        if(nameRef && nameRef.current)
            nameRef.current.focus()
        if(amountRef && amountRef.current)
            amountRef.current.focus()
        if(unitsRef && unitsRef.current)
            unitsRef.current.focus()
        if(aisleRef && aisleRef.current)
            aisleRef.current.focus()
    }, [
        isEditable.name,
        isEditable.amount,
        isEditable.units,
        isEditable.aisle
    ])

    const [updateCartItem] = useMutation(UPDATE_CART_ITEM_BY_ID, {
        variables: {item: {...item, isChecked: !isChecked, userId: me.id}},
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    const [toggleCartItem] = useMutation(TOGGLE_CART_ITEM_CHECKED_BY_ID, {
        variables: {id, isChecked: !isChecked},
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    const [clearCartItem] = useMutation(CLEAR_ITEM_FROM_SHOPPING_LIST, {
        variables: {id, isCleared: true},
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    
    

    const handleClick = () => toggleCartItem()

    // set value equal to the opposite of what that value currently is 
    const toggleEditable = (type: any) => {
        const key: string | undefined = getKeyByValue(ItemDetails, type)
        debugger
        if(key)
            dispatch({type, value: !isEditable[key]}) // e.g. ['name'] of true = false
    }

    const handleClearItemFromList = () => clearCartItem()

    const imgUrl = img ? img : ingredientPlaceholder

    return (
        <ListGroup.Item variant={isChecked ? 'dark' : 'light'}>
            <Form.Check
                type='checkbox'
                id={`${name}`}
                checked={isChecked}
            >
                <img onClick={handleClick} src={imgUrl} alt={name} style={{width: '2rem', borderRadius: '5rem' }}/>
                {
                    isEditable.name ? 
                    <Form.Control style={{width: 'fit-content'}} type="text" name="name" value={name} ref={nameRef} onBlur={() => toggleEditable(ItemDetails.name)}/> :
                    <span onClick={() => toggleEditable(ItemDetails.name)} className={isChecked ? 'completed' : ''}>{name}</span>
                }
                {
                    isEditable.amount ?
                    <Form.Control style={{width: 'fit-content'}} type="number" min="1" name="amount" value={amount.toString()} ref={amountRef} onBlur={() => toggleEditable(ItemDetails.amount)}/> :
                    <span onClick={() => toggleEditable(ItemDetails.amount)} className={isChecked ? 'completed' : ''}>{amount}</span>
                }
                {
                    isEditable.units ?
                    <Form.Control style={{width: 'fit-content'}} type="text" name="units" value={units} ref={unitsRef} onBlur={() => toggleEditable(ItemDetails.units)}/> :
                    <span onClick={() => toggleEditable(ItemDetails.units)} className={isChecked ? 'completed' : ''}>{units}</span>                    
                }
                {
                    isEditable.aisle ?
                    (
                    <span>Aisle # <Form.Control style={{width: 'fit-content', display: 'inline'}} type="number" min="1" name="aisle" value={aisle ? aisle.toString() : '1'} ref={aisleRef} onBlur={() => toggleEditable(ItemDetails.aisle)}/> </span>
                    )
                    :
                    <span onClick={() => toggleEditable(ItemDetails.aisle)} className={isChecked ? 'completed' : ''}>Aisle <Badge variant="primary">{aisle}</Badge></span>
                }
                
                <Button variant="danger" onClick={handleClearItemFromList}>X</Button>
            </Form.Check>
        </ListGroup.Item>
    )
}
export default CartItem
