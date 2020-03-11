import React, { useState, memo } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { ViewRecipeModal } from './ViewRecipeModal'
import { EditRecipeModal } from './EditRecipeModal'
import { ModalCategory } from 'lib/enums';
import { Recipe, User } from 'lib/interfaces';
import { useGetRecipeByIdLazyQuery, useDeleteRecipeByIdMutation, useMeLocalQuery } from 'generated/graphql';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import cloneDeep from '@bit/lodash.lodash.clone-deep'



interface Props {
    image: string
    title: string
    id: number
    userId: number
}

const DELETE_RECIPE_BY_ID = gql`
mutation DeleteRecipeById($recipeId: Float!, $userId: Float!) {
    deleteRecipeById(recipeId: $recipeId, userId: $userId) {
        id
        email
        recipes {
            id
            title
            image
            mealType
        }
    }
}
`

const GET_ME_LOCAL = gql`
query meLocal {
    me @client {
        id
        email
        recipes {
            id
            title
            image
            mealType
        }
    }
}
`

const GET_ME = gql`
query Me {
  me {
    id
    email
    recipes {
      id
      title
      image
      mealType
    }
  }
}
`

export const MealItem: React.FC<Props> = ({ image, title, id, userId }) => {
    // TODO: add useGetRecipeByIdQuery
    const [getRecipeById, { data }] = useGetRecipeByIdLazyQuery()
    const [deleteRecipeById] = useMutation(DELETE_RECIPE_BY_ID, {
        variables: { recipeId: id, userId },
        update(cache, { data: { deleteRecipeById } }) {
            // cloning to prevent any issues with not being able to update cache
            const { me }: any = cloneDeep(cache.readQuery({ query: GET_ME_LOCAL }))
            cache.writeQuery({ query: GET_ME_LOCAL, data: { me: deleteRecipeById } })
        }
    })

    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const handleClose = () => setShow(false);
    const handleCloseEdit = () => setShowEdit(false);
    const handleShow = async () => {
        getRecipeById({ variables: { id } })
        setShow(true)
    }
    const handleShowEdit = async () => {
        getRecipeById({ variables: { id } })
        setShowEdit(true)
    }


    const { data: notData, loading, error } = useMeLocalQuery();

    const handleDelete = () => {

        if (window.confirm('Are you sure you want to delete?')) {
            // deleteRecipeById({ variables: { id } })
            deleteRecipeById()
            console.log(notData);

        }

    }

    return (<ListGroup.Item>
        {/* only mount view modal when ready to open a recipe */}
        {data && data.getRecipeById ?
            <ViewRecipeModal show={show} handleClose={handleClose} options={{ type: ModalCategory.Edit }} recipe={data && data.getRecipeById} /> :
            null
        }

        {data && data.getRecipeById ?
            <EditRecipeModal show={showEdit} handleClose={handleCloseEdit} options={{ type: ModalCategory.Edit }} recipe={data && data.getRecipeById} /> :
            null
        }



        <span onClick={handleShow}><img src={image} alt={title} /> {title} </span><FaEdit onClick={handleShowEdit} /> <FaTrashAlt onClick={handleDelete} />
    </ListGroup.Item>)
}
