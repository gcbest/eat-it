import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { ModalType } from '../lib/enums'
import { Recipe } from 'lib/interfaces'


interface Props {
    show: boolean,
    handleClose: () => void
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

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{renderTitle(type)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h3>{data ? data.title : ''}</h3>
                <p>{data ? data.summary : ''}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
          </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
          </Button>
            </Modal.Footer>
        </Modal>
    )
}
