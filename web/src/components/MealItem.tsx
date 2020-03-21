import React, { useState, memo, useContext, useEffect } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
// import { ViewRecipeModal } from './ViewRecipeModal'
// import { EditRecipeModal } from './Modals/EditRecipeModal'
import { ModalCategory } from 'lib/enums';
import { Recipe, User, RecipeSlim, Image } from 'lib/interfaces';
import { useGetRecipeByIdLazyQuery, useDeleteRecipeByIdMutation, useMeLocalQuery, useUpdateRecipeByIdMutation, useToggleRecipeStarMutation } from 'generated/graphql';
import { FaEdit, FaTrashAlt, FaRegStar, FaStar } from "react-icons/fa";
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import cloneDeep from '@bit/lodash.lodash.clone-deep'
// import { Tag } from 'react-tag-autocomplete';
import { RecipeTag } from './RecipeTag';
import { ProfileContext } from 'pages/Profile';
import { MealsAreaContext } from './MealsArea';
import LazyLoadPic from './LazyLoadPic';
import './MealItem.css'



interface Props<T> {
    rcpSlm: T
    modalMethods?: {
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

export const MealItem: React.FC<Props<RecipeSlim>> = ({ rcpSlm, header }) => {
    const { image, title, id, tags, isStarred } = rcpSlm
    const imgInfo: Image = { src: image, alt: title, width: '100%', caption: title }
    const [modalType, setModalType] = useState<ModalCategory | undefined>(undefined)
    const { dispatch } = useContext(MealsAreaContext)
    const { me } = useContext(ProfileContext)
    const [getRecipeById, { data }] = useGetRecipeByIdLazyQuery()

    useEffect(() => {
        if (modalType && data && data.getRecipeById)
            showModal(modalType)
    }, [data && data.getRecipeById])

    const [deleteRecipeById] = useDeleteRecipeByIdMutation({
        variables: { recipeId: id, userId: me.id },
        update(cache, { data }) {
            if (!data)
                return

            const { deleteRecipeById } = data
            // cloning to prevent any issues with not being able to update cache
            const { me }: any = cloneDeep(cache.readQuery({ query: GET_ME_LOCAL }))
            me.recipes = [...deleteRecipeById.recipes]
            cache.writeQuery({ query: GET_ME_LOCAL, data: { me } })
        }
    })


    const [toggleStar] = useToggleRecipeStarMutation()


    // const [show, setShow] = useState(false);
    // const [showEdit, setShowEdit] = useState(false);
    // const handleClose = () => setShow(false);
    // const handleCloseEdit = () => setShowEdit(false);
    const handleShowModal = (modalType: ModalCategory) => {
        setModalType(modalType) // so that we know if View or Edit was selected
        getRecipeById({ variables: { id } })
        showModal(modalType)
    }

    const showModal = (type: ModalCategory) => {
        if (data && data.getRecipeById) {
            dispatch({
                type,
                value: {
                    header,
                    tags,
                    recipe: data.getRecipeById,
                }
            })
        }
    }
    // const handleShowEdit = () => {
    //     getRecipeById({ variables: { id } })
    //     setShowEdit(true)
    // }

    const { data: notData, loading, error } = useMeLocalQuery();

    const handleStarToggle = () => {
        const starred = !isStarred
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
        <div className='item'>
            <span onClick={() => handleShowModal(ModalCategory.View)} >
                <LazyLoadPic image={imgInfo} />
            </span>
            <span style={{ marginLeft: "3rem" }}>
                <FaEdit onClick={() => handleShowModal(ModalCategory.Edit)} /> <FaTrashAlt onClick={handleDelete} />
                <span style={{ marginLeft: "3rem" }}>
                    {isStarred ? <FaStar onClick={handleStarToggle} /> : <FaRegStar onClick={handleStarToggle} />}
                </span>
            </span>
        </div>
        <div>
            {tags && tags.map(t => <RecipeTag key={t.id} text={t.name} />)}
        </div>
    </ListGroup.Item>)
}
