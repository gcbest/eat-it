import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Autocomplete from 'react-autocomplete'
import useForm from 'lib/useForm'
import { CartItemInterface } from 'lib/interfaces'
import Col from 'react-bootstrap/Col'

interface Props {
    itemSuggestions: CartItemInterface[]
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
    const { inputs, handleChange, resetForm } = useForm()

    return (
        <Form>
            <Form.Group controlId="addCartItem">
                <Form.Row>
                    <Col>
                        <Form.Label>Item Name</Form.Label>
                        <Autocomplete
                            getItemValue={(item) => item.name}
                            items={itemSuggestions}
                            renderItem={(item, isHighlighted) =>
                                <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                    {item.name}
                                </div>
                            }
                            inputProps={{style: formControlStyles, name: 'name'}}
                            selectOnBlur={true}
                            value={inputs.name}
                            onChange={handleChange}
                            onSelect={(val) => inputs.name = val}
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
                </Form.Row>
            </Form.Group>
        </Form>
    )
}

export default AddCartItem
