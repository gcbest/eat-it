import React, { Fragment, useEffect, forwardRef } from 'react'
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
    className: string
}

const CartTextInput = forwardRef(({isEditable, inputType, name, min, handleChange, value, details, className, toggleEditable}: Props, ref: any) => {
    useEffect(() => {
        if(ref && ref.current)
            ref.current.focus()
    }, [isEditable, ref])

    const detailsStyles: {margin: string, wordBreak: 'break-word' | 'normal'} = {margin: window.innerWidth > 600 ? '0 0.5rem' : '0', wordBreak: name === 'unit' ? 'break-word' : 'normal'}

    // Aisle Input
    if(name==='aisle') {
        return (
            <Fragment> {
                isEditable ?
                (<span><div>Aisle #</div> <Form.Control style={{width: 'fit-content', display: 'inline'}} type={inputType} min={min} name={name} onChange={handleChange} value={value} ref={ref} onBlur={() => toggleEditable(details)}/> </span>)
                    : <span className={className} onClick={() => toggleEditable(details)}><Badge variant="primary"><span className={className}>Aisle {value}</span></Badge></span>
            }
            </Fragment>
        )
    }

    return (
        <Fragment> {
            isEditable ?
            <Form.Control style={{width: 'fit-content'}} type={inputType} name={name} onChange={handleChange} value={value} min={min} ref={ref} onBlur={() => toggleEditable(details)}/> :
            <span style={detailsStyles} className={className} onClick={() => toggleEditable(details)}>{value}</span>
        }
        </Fragment>
    )
})

export default CartTextInput
