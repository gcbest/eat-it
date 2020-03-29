import React, { Fragment, useState, useContext, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { ModalInterface, ModalProps } from 'lib/interfaces'
import { createMarkup, getKeyByValue } from 'lib/utils'
import { GET_ME_LOCAL } from 'graphql/queriesAndMutations'
import { useDeleteRecipeByIdMutation } from 'generated/graphql'
import { MealCategory } from 'lib/enums'


export const ViewRecipeHeader: React.FC<ModalProps<ModalInterface>> = ({ params }) => {
    const { recipe } = params
    const header = getKeyByValue(MealCategory, recipe!.mealType)

    return (
        <Modal.Title>{recipe!.title} <Badge variant="secondary">{header}</Badge></Modal.Title>
    )
}

export const ViewRecipeBody: React.FC<ModalProps<ModalInterface>> = ({ params }) => {
    const { recipe } = params
    const { image, title, readyInMinutes, servings, summary } = recipe!

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

export const ViewRecipeFooter: React.FC<ModalProps<ModalInterface>> = ({ params, me }) => {
    const { recipe } = params
    const handleClose = () => null
    const { id } = recipe!

    const [deleteRecipeById] = useDeleteRecipeByIdMutation({
        variables: { recipeId: id!, userId: me!.id },
        update(cache, { data }) {
            // cloning to prevent any issues with not being able to update cache
            // const { me }: any = cloneDeep(cache.readQuery({ query: GET_ME_LOCAL }))
            if (data)
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