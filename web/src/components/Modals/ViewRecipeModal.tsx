import React, { Fragment } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { ModalInterface, ModalProps } from 'lib/interfaces'
import { getKeyByValue } from 'lib/utils'
import { GET_ME_LOCAL } from 'graphql/queriesAndMutations'
import { useDeleteRecipeByIdMutation } from 'generated/graphql'
import { MealCategory } from 'lib/enums'
import RecipeCardBody from 'components/RecipeCardBody'
import RecipeTagsArea from 'components/RecipeTagsArea';



export const ViewRecipeHeader: React.FC<ModalProps<ModalInterface>> = ({ params }) => {
    const { recipe } = params
    const header = getKeyByValue(MealCategory, recipe!.mealType)

    return (<Modal.Title>{recipe!.title} <br/> <Badge variant="secondary">{header}</Badge></Modal.Title>)
}

export const ViewRecipeBody: React.FC<ModalProps<ModalInterface>> = ({ params, me }) => {
    const { recipe } = params
    return (<RecipeCardBody recipe={recipe!} me={me!}/>)
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
        <Fragment>
            {recipe && recipe.tags.length && 
            <RecipeTagsArea params={params} me={me} />
            }
        <Button variant="danger" onClick={deleteRecipe}>
            Delete
        </Button>
        </Fragment>
    )
}