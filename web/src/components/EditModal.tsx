import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import { ModalCategory, MealCategory } from '../lib/enums'
import { Recipe, ModalInterface } from 'lib/interfaces'
import useForm from 'lib/useForm';


interface Props extends ModalInterface {
    type: ModalCategory
    data: Recipe | null
}

export const EditModal: React.FC<Props> = ({ show, handleClose, type, data }) => {
    const renderText = (type: ModalCategory): string => {
        // let text = {title: '', actionButton: ''}
        switch (type) {
            case ModalCategory.New:
                return 'Add'
            case ModalCategory.Edit:
                return 'Edit'
        }
    }

    const { inputs, handleChange } = useForm({
        mealType: ""
    });

    return (
        <Modal show={show} onHide={() => handleClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{`${renderText(type)} This Recipe`}</Modal.Title>
                <Form>
                    <Form.Group controlId="exampleForm.ControlSelect2">
                        <Form.Label>Example multiple select</Form.Label>
                        <Form.Control as="select" name="mealType" value={inputs.mealType} onChange={handleChange}>
                            {Object.keys(MealCategory).filter((key: string | number | any) => !isNaN(Number(MealCategory[key]))).map((key: string | any) => <option key={key} value={MealCategory[key]}>{key}</option>)}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Header>
            <Modal.Body>
                <h3>{data ? data.title : ''}</h3>
                <p>{data ? data.summary : ''}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClose(true)}>
                    {`${renderText(type)} Recipe`}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
