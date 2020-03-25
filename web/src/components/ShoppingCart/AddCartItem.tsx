import React, { useState, useContext } from 'react'
import Form from 'react-bootstrap/Form'
import Autocomplete from 'react-autocomplete'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import {FaPlus} from 'react-icons/fa'
import { CartItemInterface } from 'lib/interfaces'
import useForm from 'lib/useForm'
import { ProfileContext } from 'pages/Profile'
import { ADD_CART_ITEM, GET_CART_ITEMS_BY_USER_ID } from 'graphql/queriesAndMutations'
import { useMutation, useQuery } from '@apollo/react-hooks'

interface Props {
    itemSuggestions: CartItemInterface[]
    // setNewItem: (newItem: CartItemInterface) => void
}

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
const AddCartItem: React.FC<Props> = ({ itemSuggestions }) => {
    const [selectedItem, setSelectedItem] = useState<CartItemInterface | null>(null)
    // const [newItem, setNewItem] = useState<CartItemInterface>({ name: '', amount: 0, isChecked: false })
    const {me} = useContext(ProfileContext)

    const [addCartItem, {loading, error, data}] = useMutation(ADD_CART_ITEM, {
        // update(cache, { data }) {
        //     // cloning to prevent any issues with not being able to update cache
        //     const { me }: any = cloneDeep(cache.readQuery({ query: GET_ME_LOCAL }))
        //     if (data && data.addRecipe)
        //         cache.writeQuery({ query: GET_ME_LOCAL, data: { me: data.addRecipe } })
        // }
        refetchQueries: [{query: GET_CART_ITEMS_BY_USER_ID, variables: {id: me.id}} ]
    })
    const { inputs, handleChange, forceChange, resetForm } = useForm({
        name: '',
        amount: 1,
        units: '',
        aisle: 1,
        img: '',
        isChecked: false,
    })


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // debugger
        addCartItem({variables: {item: {...inputs, userId: me.id}}})
    }

    const handleSelection = (val: any) => {
        // set other input values 
        const {name, amount, units, aisle} = selectedItem!
        const update: any = {}
        update.name = name
        update.amount = amount
        update.units = units
        update.aisle = aisle

        const updates = [{}]
        forceChange(update)
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="addCartItem">
                <Form.Row>
                    <Col>
                        <Form.Label>Item Name</Form.Label>
                        <Autocomplete
                            getItemValue={(item) => { setSelectedItem(item); return item.name}}
                            items={itemSuggestions}
                            renderItem={(item, isHighlighted) =>
                                <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                    {item.name} | {item.amount} | {item.units} | {item.aisle}
                                </div>
                            }
                            inputProps={{style: formControlStyles, name: 'name'}}
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
                            <Button type="submit"><FaPlus/></Button>
                    </Col>
                </Form.Row>
            </Form.Group>
        </Form>
    )
}

export default AddCartItem
