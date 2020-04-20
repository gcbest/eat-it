import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Autosuggest from 'react-autosuggest';
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { FaPlus } from 'react-icons/fa'
import { CartItemInterface, User } from 'lib/interfaces'
import useForm from 'lib/useForm'
import { ADD_CART_ITEM, GET_CART_ITEMS_BY_USER_ID, DELETE_CART_ITEM } from 'graphql/queriesAndMutations'
import { useMutation } from '@apollo/react-hooks'
import addCartItemStyles from './AddCartItem.module.css'
import './AddCartItem.css'

interface Props {
    itemSuggestions: CartItemInterface[]
    me: User
}

const AddCartItem: React.FC<Props> = ({ itemSuggestions, me }) => {
    const [addCartItem] = useMutation(ADD_CART_ITEM, {
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    const [deleteCartItem] = useMutation(DELETE_CART_ITEM, {
        refetchQueries: [{ query: GET_CART_ITEMS_BY_USER_ID, variables: { id: me.id } }]
    })

    const { inputs, handleChange, forceChange, resetForm } = useForm({
        name: '',
        amount: 1,
        unit: '',
        aisle: 0,
        img: '',
        isChecked: false,
        isCleared: false
    })


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        addCartItem({ variables: { item: { ...inputs, userId: me.id } } })
        resetForm()
    }


    const handleDelete = (id: number | undefined) => {
        if (id && window.confirm('Are you sure you want to delete item?'))
            deleteCartItem({ variables: { id } })
    }

    // AUTOSUGGEST

    const [suggestions, setSuggestions] = useState<CartItemInterface[]>(itemSuggestions)

    // Teach Autosuggest how to calculate suggestions for any given input value.
    const getSuggestions = (value: string) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : itemSuggestions.filter(item =>
            item.name.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    // When suggestion is clicked, Autosuggest needs to populate the input
    // based on the clicked suggestion.
    const getSuggestionValue = (suggestion: CartItemInterface) => (suggestion.name)

    const renderSuggestion = (item: CartItemInterface, params: { isHighlighted: boolean, query: string }) => (
        <div style={{ background: params.isHighlighted ? 'lightgray' : 'white' }}>
            {item.name} | {item.amount} | {item.unit} | {item.aisle} | <Button onClick={() => handleDelete(item.id)} size="sm" variant="danger">x</Button>
        </div>
    );

    // Autosuggest will call this function every time you need to update suggestions.
    const onSuggestionsFetchRequested = ({ value }: { value: any }) => {
        setSuggestions(getSuggestions(value))
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([])
    };

    const onSuggestionSelected = (event: any, { suggestion }: { suggestion: CartItemInterface }) => {
        // set other input values once an item name is selected 
        const { name, amount, unit, aisle } = suggestion!
        const update: any = { name, amount, unit, aisle }
        forceChange(update)
    }

    const inputProps = {
        placeholder: 'Enter item name',
        value: inputs.name,
        onChange: handleChange,
        name: 'name',
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="addCartItem">
                <Form.Row>
                    <Col sm={7} md={3}>
                        <Form.Group controlId="name">
                            <Form.Label className={addCartItemStyles.labels}>Item Name</Form.Label>
                            <Autosuggest
                                suggestions={suggestions}
                                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                onSuggestionsClearRequested={onSuggestionsClearRequested}
                                getSuggestionValue={getSuggestionValue}
                                onSuggestionSelected={onSuggestionSelected}
                                renderSuggestion={renderSuggestion}
                                inputProps={inputProps}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={7} md={3}>
                        <Form.Group controlId="amount">
                            <Form.Label className={addCartItemStyles.labels}>Amount</Form.Label>
                            <Form.Control type="number" name="amount" value={inputs.amount} onChange={handleChange} min="1" />
                        </Form.Group>
                    </Col>
                    <Col sm={7} md={2}>
                        <Form.Group controlId="unit">
                            <Form.Label className={addCartItemStyles.labels}>Units</Form.Label>
                            <Form.Control type="text" name="unit" value={inputs.unit} onChange={handleChange} placeholder="lbs/bags/etc" />
                        </Form.Group>
                    </Col>
                    <Col sm={7} md={3}>
                        <Form.Group controlId="aisle">
                            <Form.Label className={addCartItemStyles.labels}>Aisle #</Form.Label>
                            <Form.Control type="number" name="aisle" value={inputs.aisle} onChange={handleChange} min="0" />
                        </Form.Group>
                    </Col>
                    <Col sm={7} md={1} style={{ position: 'relative', marginBottom: '1rem' }}>
                        <Button className={addCartItemStyles.addBtn} variant="secondary" type="submit">Add <FaPlus /></Button>
                    </Col>
                </Form.Row>
            </Form.Group>
        </Form>
    )
}

export default AddCartItem
