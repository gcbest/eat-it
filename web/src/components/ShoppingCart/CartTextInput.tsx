import React, { Fragment, useEffect, forwardRef, RefForwardingComponent } from 'react'
import Form from 'react-bootstrap/Form'
import { ItemDetails } from 'lib/enums'
import Badge from 'react-bootstrap/Badge'

interface Props {
    isEditable: boolean
    inputType: string
    name: string
    min?: string
    details: ItemDetails
    handleChange: (e: any) => void
    toggleEditable: (detail: ItemDetails) => void
    value: string
    className: string,
}

const CartTextInput = forwardRef(({isEditable, inputType, name, min, handleChange, value, details, className, toggleEditable}: Props, ref: any) => {
    useEffect(() => {
        if(ref && ref.current)
            ref.current.focus()
    }, [isEditable])

    // Aisle Input
    if(name==='aisle') {
        return (
            <Fragment> {
                isEditable ?
                (<span>Aisle # <Form.Control style={{width: 'fit-content', display: 'inline'}} type={inputType} min={min} name={name} onChange={handleChange} value={value} ref={ref} onBlur={() => toggleEditable(details)}/> </span>)
                    : <span className={className} onClick={() => toggleEditable(details)}><Badge variant="primary"><span className={className}>Aisle {value}</span></Badge></span>
            }
            </Fragment>
        )
    }

    return (
        <Fragment> {
            isEditable ?
            <Form.Control style={{width: 'fit-content'}} type={inputType} name={name} onChange={handleChange} value={value.toString()} min={min} ref={ref} onBlur={() => toggleEditable(details)}/> :
            <span style={{margin: '0.5rem'}} className={className} onClick={() => toggleEditable(details)}>{value}</span>
        }
        </Fragment>
    )
})

export default CartTextInput
