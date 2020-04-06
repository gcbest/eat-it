import React, { Fragment, useContext, useEffect, useState } from 'react'
import { ModalInterface, User, RecipeSlim, ModalProps } from './interfaces'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { getEnumNames, createMarkup } from './utils'
import { MealCategory, ModalCategory } from './enums'
import useForm from './useForm'
import Badge from 'react-bootstrap/Badge'
import { useDeleteRecipeByIdMutation, useAddRecipeMutation, EditRecipeInput, useUpdateRecipeByIdMutation } from 'generated/graphql'
import { GET_ME_LOCAL, GET_RECIPE_BY_ID } from 'graphql/queriesAndMutations'
import Button from 'react-bootstrap/Button'
import { CreateRecipeHeader, CreateRecipeBody, CreateRecipeFooter } from 'components/Modals/CreateRecipeModal'
import { EditRecipeHeader, EditRecipeBody, EditRecipeFooter } from 'components/Modals/EditRecipeModal'
import { ViewRecipeHeader, ViewRecipeBody, ViewRecipeFooter } from 'components/Modals/ViewRecipeModal'
import RecipeTagsArea from 'components/RecipeTagsArea'

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