import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import { ModalType, MealType } from '../lib/enums'
import { Recipe } from 'lib/interfaces'
import useForm from 'lib/useForm';


interface Props {
    show: boolean,
    handleClose: (isSaved: boolean) => void
    type: ModalType
    data: Recipe | null
}

export const EditModal: React.FC<Props> = ({ show, handleClose, type, data }) => {
    const renderTitle = (type: ModalType): string => {
        switch (type) {
            case ModalType.New:
                return 'Save This Recipe'
            case ModalType.Edit:
                return 'Edit This Recipe'
        }
    }

    const { inputs, handleChange } = useForm({
        mealType: ""
    });

    return (
        <Modal show={show} onHide={() => handleClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{renderTitle(type)}</Modal.Title>
                <Form>
                    <Form.Group controlId="exampleForm.ControlSelect2">
                        <Form.Label>Example multiple select</Form.Label>
                        <Form.Control as="select" name="mealType" value={inputs.mealType} onChange={handleChange}>
                            {Object.keys(MealType).filter((key: string | number | any) => !isNaN(Number(MealType[key]))).map((key: string | any) => <option key={key} value={MealType[key]}>{key}</option>)}
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
                    Save Recipe
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
