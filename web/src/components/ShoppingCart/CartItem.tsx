import React, { useReducer, useRef } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { GET_CART_ITEMS_BY_USER_ID, UPDATE_CART_ITEM_BY_ID, TOGGLE_CART_ITEM_CHECKED_BY_ID, CLEAR_ITEM_FROM_SHOPPING_LIST } from 'graphql/queriesAndMutations'
import { useMutation } from '@apollo/react-hooks'
import { CartItemInterface, User, CartItemEditables } from 'lib/interfaces'
import ingredientPlaceholder from '../../assets/images/ingredients_placeholder.png'
import Button from 'react-bootstrap/Button'
import { ItemDetails } from 'lib/enums'
import { getKeyByValue, truncateDecimal } from 'lib/utils'
import FormControl from 'react-bootstrap/FormControl'
import useForm from 'lib/useForm'
import classNames from 'classnames/bind'
import cartItemStyles from './CartItem.module.css'
import CartTextInput from './CartTextInput'

const cx = classNames.bind(cartItemStyles)

interface Props {
    item: CartItemInterface
    me: User
}

const initialState: CartItemEditables = {
    name: false,
    amount: false,
    unit: false,
    aisle: false,
}

const reducer = (state: CartItemEditables, action: any): CartItemEditables => {
    const { type, value } = action
    switch (type) {
        case ItemDetails.name:
            return { ...state, name: value }
        case ItemDetails.amount:
            return { ...state, amount: value }
        case ItemDetails.unit:
            return { ...state, unit: value }
        case ItemDetails.aisle:
            return { ...state, aisle: value }
        default:
            return state
    }
}

const CartItem: React.FC<Props> = ({ me, item }) => {
    const { id, name, aisle, amount, unit, img, isChecked } = item
    const nameRef = useRef<FormControl<"input"> & HTMLInputElement>(null)
    const amountRef = useRef<FormControl<"input"> & HTMLInputElement>(null)
    const unitRef = useRef<FormControl<"input"> & HTMLInputElement>(null)
    const aisleRef = useRef<FormControl<"input"> & HTMLInputElement>(null)
    const [isEditable, dispatch] = useReducer(reducer, initialState)

    const { inputs, handleChange } = useForm({
        name,
        amount,
        unit,
        aisle,
    });

    const [updateCartItem] = useMutation(UPDATE_CART_ITEM_BY_ID, {
        variables: { item: { ...item, ...inputs, userId: me.id } },
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    const [toggleCartItem] = useMutation(TOGGLE_CART_ITEM_CHECKED_BY_ID, {
        variables: { id, isChecked: !isChecked },
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    const [clearCartItem] = useMutation(CLEAR_ITEM_FROM_SHOPPING_LIST, {
        variables: { id, isCleared: true },
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    const handleClick = () => toggleCartItem()

    // set value equal to the opposite of what that value currently is 
    const toggleEditable = (type: any) => {
        if (window.innerWidth < 650) // do not allow toggle on mobile, view only since it is easy to fat-finger the edit area
            return

        const key: string | undefined = getKeyByValue(ItemDetails, type)
        if (!key) return

        const isInputEditable = isEditable[key]
        if (isInputEditable) // turning from editable to non-editable, so auto save changes made
            updateCartItem()
        dispatch({ type, value: !isInputEditable }) // e.g. ['name'] of true set = to false now
    }

    const handleClearItemFromList = () => {
        if (window.confirm('Are you sure you want to clear item?'))
            clearCartItem()
    }
    const imgUrl = img ? img : ingredientPlaceholder

    // Add conditional classNames
    let className = cx({
        completed: isChecked,
        itemInfo: true,
        displayImage: false
    })

    return (
        <ListGroup.Item variant={isChecked ? 'dark' : 'light'} style={{borderTopWidth: '0.5px'}}>
            <div className={cartItemStyles.layout}>

                <img onClick={handleClick} src={imgUrl} alt={name} className={cartItemStyles.displayImage} />

                <span style={{ position: 'relative' }}>

                    <Button className={cartItemStyles.clearItemBtn} variant="danger" onClick={handleClearItemFromList}>X</Button>
                </span>

                <CartTextInput isEditable={isEditable.name} inputType="text" name="name"
                    handleChange={handleChange} value={inputs.name} ref={nameRef}
                    details={ItemDetails.name}
                    toggleEditable={toggleEditable}
                    className={className}
                />

                <span>
                    <CartTextInput isEditable={isEditable.amount} inputType="number" min="1" name="amount"
                        handleChange={handleChange} value={truncateDecimal(inputs.amount).toString()} ref={amountRef}
                        details={ItemDetails.amount}
                        toggleEditable={toggleEditable}
                        className={className}
                    />

                    <CartTextInput isEditable={isEditable.unit} inputType="text" name="unit"
                        handleChange={handleChange} value={inputs.unit} ref={unitRef}
                        details={ItemDetails.unit}
                        toggleEditable={toggleEditable}
                        className={className}
                    />

                    <CartTextInput isEditable={isEditable.aisle} inputType="number" min="0" name="aisle"
                        handleChange={handleChange} value={inputs.aisle} ref={aisleRef}
                        details={ItemDetails.aisle}
                        toggleEditable={toggleEditable}
                        className={className}
                    />

                </span>
            </div>
        </ListGroup.Item>
    )
}
export default CartItem
