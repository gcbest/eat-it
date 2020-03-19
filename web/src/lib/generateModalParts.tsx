import React, { Fragment } from 'react'
import { ModalInterface, User } from './interfaces'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { getEnumNames, createMarkup } from './utils'
import { MealCategory, ModalCategory } from './enums'
import useForm from './useForm'
import Badge from 'react-bootstrap/Badge'
import { useDeleteRecipeByIdMutation } from 'generated/graphql'
import { GET_ME_LOCAL } from 'graphql/queriesAndMutations'
import Button from 'react-bootstrap/Button'

interface Props<T>{
    params: T
    me?: User
}

const ViewRecipeHeader: React.FC<Props<ModalInterface>> = ({params}) => {
    const { recipe, header } = params
    
    return (
        <Modal.Title>{recipe!.title} <Badge variant="secondary">{header}</Badge></Modal.Title>
    )
}

const EditRecipeHeader: React.FC<Props<ModalInterface>> = () => {
    const { id, title, readyInMinutes, servings, image, summary, sourceUrl, analyzedInstructions, mealType } = recipe!

    const { inputs, handleChange, resetForm, isCreateRecipeValid } = useForm({
        title,
        readyInMinutes,
        servings,
        image,
        summary,
        sourceUrl,
        analyzedInstructions,
        mealType
    });

    return (
        <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
                <Form>
                    <Form.Group controlId="view-header">
                        <Form.Control as="select" name="mealType" value={inputs.mealType} onChange={handleChange}>
                            {getEnumNames(MealCategory).map((key: string | any) => <option key={key} value={MealCategory[key]}>{key}</option>)}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Header>
    )
}

const CreateRecipeHeader: React.FC<Props<ModalInterface>> = ({params}) => {
    const { header } = params

    return (
        <Modal.Title>Create New Recipe <Badge variant="secondary">{header}</Badge></Modal.Title>
    )
}

const ViewRecipeBody: React.FC<Props<ModalInterface>> = ({params}) => {
    const { recipe } = params
    const {image, title, readyInMinutes, servings, summary} = recipe!
    
    return (
        <Fragment>
            {image &&
                <img src={image} alt={title} />}
            <h3>{title}</h3>
            <p>
                <span>Ready in: <strong>{readyInMinutes}</strong> mins</span><span style={{ marginLeft: '1rem' }}>Servings: {servings}</span>
            </p>
            {<p dangerouslySetInnerHTML={createMarkup(summary)}></p>}
        </Fragment>
    )
}

const ViewRecipeFooter: React.FC<Props<ModalInterface>> = ({params, me}) => {
    const { recipe, handleClose } = params
    const {id} = recipe!
    
    const [deleteRecipeById] = useDeleteRecipeByIdMutation({
        variables: { recipeId: id!, userId: me!.id },
        update(cache, { data }) {
            // cloning to prevent any issues with not being able to update cache
            // const { me }: any = cloneDeep(cache.readQuery({ query: GET_ME_LOCAL }))
            if(data)
                cache.writeQuery({ query: GET_ME_LOCAL, data: { me: data.deleteRecipeById } })
        }
    })

    const deleteRecipe = () => {
        if (window.confirm('Are you sure you want to delete?')) {
            deleteRecipeById()
            handleClose()
        }
    }
    
    return (
        <Button variant="danger" onClick={deleteRecipe}>
            Delete
        </Button>
    )
}

export const useGenerateModalParts = (type: ModalCategory, params: ModalInterface , me: User) => {
    let ModalHeader: React.ReactElement | null = null
    let ModalBody: React.ReactElement | null = null
    let ModalFooter: React.ReactElement | null = null

    switch(type) {
        case ModalCategory.Create:
            ModalHeader = CreateRecipeHeader({params})
            // ModalBody = 
            // ModalFooter = 
            break
        case ModalCategory.View:
            ModalHeader = ViewRecipeHeader({params})
            ModalBody = ViewRecipeBody({params})
            ModalFooter = ViewRecipeFooter({params, me})
            break
        case ModalCategory.Edit:
            // ModalHeader = 
            // ModalBody = <EditRecipeModal params={params}/>
            // ModalFooter = 
            break
        default:
            // ModalHeader = 
            // ModalBody = <ViewRecipeModal params={params}/>
            // ModalFooter = 
    }

    const getHeader = () => ModalHeader

    const getBody = () => ModalBody

    const getFooter = () => ModalFooter

    return {getHeader, getBody, getFooter}


}