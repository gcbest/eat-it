import React from 'react'
import { ModalInterface, User } from './interfaces'
import { ModalCategory } from './enums'
import { CreateRecipeHeader, CreateRecipeBody, CreateRecipeFooter } from 'components/Modals/CreateRecipeModal'
import { EditRecipeHeader, EditRecipeBody, EditRecipeFooter } from 'components/Modals/EditRecipeModal'
import { ViewRecipeHeader, ViewRecipeBody, ViewRecipeFooter } from 'components/Modals/ViewRecipeModal'

export const useGenerateModalParts = (type: ModalCategory, params: ModalInterface, me: User, handleClose?: () => void) => {
    let ModalHeader: React.ReactElement | null = null
    let ModalBody: React.ReactElement | null = null
    let ModalFooter: React.ReactElement | null = null



    switch (type) {
        case ModalCategory.Create:
            ModalHeader = <CreateRecipeHeader params={params} />
            ModalBody = <CreateRecipeBody params={params} handleClose={handleClose} me={me}/>
            ModalFooter = <CreateRecipeFooter params={params} />
            break
        case ModalCategory.View:
            ModalHeader = <ViewRecipeHeader params={params} />
            ModalBody = <ViewRecipeBody params={params} me={me}/>
            ModalFooter = <ViewRecipeFooter params={params} me={me} />
            break
        case ModalCategory.Edit:
            ModalHeader = <EditRecipeHeader params={params} />
            ModalBody = <EditRecipeBody params={params} handleClose={handleClose} me={me}/>
            ModalFooter = <EditRecipeFooter/>
            break
        default:
        ModalHeader =null
        ModalBody = null
        ModalFooter =null
    }

    const getHeader = () => ModalHeader

    const getBody = () => ModalBody

    const getFooter = () => ModalFooter

    return { getHeader, getBody, getFooter }
}