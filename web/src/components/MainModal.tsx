import React, { useState, useContext } from 'react'
import Modal from 'react-bootstrap/Modal'
import { ModalInterface, User } from 'lib/interfaces'
import { MealCategory } from 'lib/enums'
import { ProfileContext } from 'pages/Profile'
import { useGenerateModalParts } from 'lib/useGenerateModalParts'
import './MainModal.css'
interface Props<T> {
    params: T
    me: User
    handleClose: () => void
}

const MainModal: React.FC<Props<ModalInterface>> = ({ params, handleClose }) => {
    const { me } = useContext(ProfileContext)
    const { show, modalType, recipe } = params
    const [mealType, setMealType] = useState<MealCategory | undefined>(params.mealType || (recipe && recipe.mealType)) //since meal type is found in header and body contains rest of form 
    const { getHeader, getBody, getFooter } = useGenerateModalParts(modalType!, { ...params, mealType, setMealType }, me, handleClose)


    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    {getHeader()}
                </Modal.Header>
                <Modal.Body>
                    {getBody()}
                </Modal.Body>
                <Modal.Footer>
                    {getFooter()}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default MainModal
