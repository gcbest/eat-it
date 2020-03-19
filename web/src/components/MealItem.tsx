import React, { useState, memo, useContext, useEffect } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { ViewRecipeModal } from './ViewRecipeModal'
import { EditRecipeModal } from './EditRecipeModal'
import { ModalCategory } from 'lib/enums';
import { Recipe, User, RecipeSlim } from 'lib/interfaces';
import { useGetRecipeByIdLazyQuery, useDeleteRecipeByIdMutation, useMeLocalQuery, useUpdateRecipeByIdMutation, useToggleRecipeStarMutation } from 'generated/graphql';
import { FaEdit, FaTrashAlt, FaRegStar, FaStar } from "react-icons/fa";
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import cloneDeep from '@bit/lodash.lodash.clone-deep'
import { Tag } from 'react-tag-autocomplete';
import { RecipeTag } from './RecipeTag';
import { ProfileContext, Profile } from 'pages/Profile';



interface Props<T> {
    rcpSlm: T
    modalMethods: {
        setModalType: (modalType: ModalCategory) => void
        handleShow: (header: string) => void
        setRecipe: (recipe: Recipe) => void
    }
    header: string
}

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

export const MealItem: React.FC<Props<RecipeSlim>> = ({rcpSlm, modalMethods, header}) => {
    const { image, title, id, tags, isStarred } = rcpSlm
    const {setModalType, setRecipe, handleShow} = modalMethods
    
    // TODO: add useGetRecipeByIdQuery
    
    // const {me, showRecipe, setShowRecipe, handleShowRecipe, handleCloseRecipe} = useContext(ProfileContext)
    const {me} = useContext(ProfileContext)
    const [getRecipeById, { data }] = useGetRecipeByIdLazyQuery()
    // const [deleteRecipeById] = useMutation(DELETE_RECIPE_BY_ID, {
    //     variables: { recipeId: id, userId },
    //     update(cache, { data: { deleteRecipeById } }) {
    //         // cloning to prevent any issues with not being able to update cache
    //         const { me }: any = cloneDeep(cache.readQuery({ query: GET_ME_LOCAL }))
    //         cache.writeQuery({ query: GET_ME_LOCAL, data: { me: deleteRecipeById } })
    //     }
    // })

    useEffect(() => {
        if(data && data.getRecipeById)
            setRecipe(data.getRecipeById)
    }, [data])

    const [deleteRecipeById] = useDeleteRecipeByIdMutation({
            variables: { recipeId: id, userId: me.id },
            update(cache, { data }) {
                if(!data)
                    return
                
                const {deleteRecipeById} = data 
                // cloning to prevent any issues with not being able to update cache
                const { me }: any = cloneDeep(cache.readQuery({ query: GET_ME_LOCAL }))
                me.recipes = [...deleteRecipeById.recipes]
                cache.writeQuery({ query: GET_ME_LOCAL, data: { me } })
            }
        })


    const [toggleStar] = useToggleRecipeStarMutation()


    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const handleClose = () => setShow(false);
    const handleCloseEdit = () => setShowEdit(false);
    const showViewModal = () => {
        getRecipeById({ variables: { id } })
        handleShow(header)
    }
    const handleShowEdit = () => {
        getRecipeById({ variables: { id } })
        setShowEdit(true)
    }

    const { data: notData, loading, error } = useMeLocalQuery();

    const handleStarToggle = () => {
        const starred  = !isStarred
        toggleStar({
            variables: {
                userId: me.id,
                recipeId: id, 
                isStarred: starred
            },
            update(cache, { data }) {
                console.log(data);
                
                // cloning to prevent any issues with not being able to update cache
                const { me }: any = cloneDeep(cache.readQuery({ query: GET_ME_LOCAL }))
                cache.writeQuery({ query: GET_ME_LOCAL, data: { me: toggleStar } })
            }
        })
    }

    const handleDelete = () => {

        if (window.confirm('Are you sure you want to delete?')) {
            // deleteRecipeById({ variables: { id } })
            deleteRecipeById()
            console.log(notData);

        }

    }

    return (<ListGroup.Item>
        {/* only mount view modal when ready to open a recipe */}
        {/* {data && data.getRecipeById ?
            <ViewRecipeModal show={show} handleClose={handleClose} options={{ type: ModalCategory.View }} recipe={data && data.getRecipeById} /> :
            null
        }

        {data && data.getRecipeById ?
            <EditRecipeModal show={showEdit} handleClose={handleCloseEdit} options={{ type: ModalCategory.Edit }} recipe={data && data.getRecipeById} /> :
            null
        } */}



        <span onClick={showViewModal}><img src={image} alt={title} /> {title} </span>
        <FaEdit onClick={handleShowEdit} /> <FaTrashAlt onClick={handleDelete} />
        <span style={{marginLeft: "3rem"}}>
            {isStarred ? <FaStar onClick={handleStarToggle}/> : <FaRegStar onClick={handleStarToggle}/>}
        </span>
        <div>
            {tags && tags.map(t => <RecipeTag key={t.id} text={t.name} />)}
        </div>
    </ListGroup.Item>)
}
