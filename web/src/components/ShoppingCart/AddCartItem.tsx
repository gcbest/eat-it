import React, { useState, useContext } from 'react'
import Form from 'react-bootstrap/Form'
import Autocomplete from 'react-autocomplete'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { FaPlus } from 'react-icons/fa'
import { CartItemInterface, User } from 'lib/interfaces'
import useForm from 'lib/useForm'
import { ADD_CART_ITEM, GET_CART_ITEMS_BY_USER_ID, DELETE_CART_ITEM } from 'graphql/queriesAndMutations'
import { useMutation } from '@apollo/react-hooks'

interface Props {
    itemSuggestions: CartItemInterface[]
    me: User
}

//TODO: move this style out
const formControlStyles = {
    display: 'block',
    width: '100%',
    height: 'calc(1.5em + 0.75rem + 2px)',
    padding: '0.375rem 0.75rem',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    color: '#5a5a5a',
    backgroundColor: '#fff',
    backgroundClip: 'padding-box',
    border: '1px solid #ced4da',
    borderRadius: '0.4rem',
    transition: 'border-color 0.15s'
}

const AddCartItem: React.FC<Props> = ({ itemSuggestions, me }) => {
    const [selectedItem, setSelectedItem] = useState<CartItemInterface | null>(null)

    const [addCartItem] = useMutation(ADD_CART_ITEM, {
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    const [deleteCartItem] = useMutation(DELETE_CART_ITEM, {
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    const { inputs, handleChange, forceChange, resetForm } = useForm({
        name: '',
        amount: 1,
        units: '',
        aisle: 1,
        img: '',
        isChecked: false,
        isCleared: false
    })


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        addCartItem({ variables: { item: { ...inputs, userId: me.id } } })
        resetForm()
    }

    const handleSelection = (val: any) => {
        // set other input values once an item name is selected 
        const { name, amount, units, aisle } = selectedItem!
        const update: any = { name, amount, units, aisle }
        forceChange(update)
    }

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete item?'))
            deleteCartItem({ variables: { id } })
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="addCartItem">
                <Form.Row>
                    <Col>
                        <Form.Label>Item Name</Form.Label>
                        <Autocomplete
                            getItemValue={(item) => { setSelectedItem(item); return item.name }}
                            items={itemSuggestions} renderItem={(item, isHighlighted) =>
                                <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                    {item.name} | {item.amount} | {item.units} | {item.aisle} | <Button onClick={() => handleDelete(item.id)} size="sm" variant="danger">x</Button>
                                </div>
                            }
                            inputProps={{ style: formControlStyles, name: 'name' }}
                            // selectOnBlur={true}
                            value={inputs.name}
                            onChange={handleChange}
                            onSelect={handleSelection}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="number" name="amount" value={inputs.amount} onChange={handleChange} min="1" />
                    </Col>
                    <Col>
                        <Form.Label>Units</Form.Label>
                        <Form.Control type="text" name="units" value={inputs.units} onChange={handleChange} placeholder="lbs/bags/etc" />
                    </Col>
                    <Col>
                        <Form.Label>Aisle #</Form.Label>
                        <Form.Control type="number" name="aisle" value={inputs.aisle} onChange={handleChange} min="1" />
                    </Col>
                    <Col>
                        <Button type="submit"><FaPlus /></Button>
                    </Col>
                </Form.Row>
            </Form.Group>
        </Form>
    )
}

export default AddCartItem
