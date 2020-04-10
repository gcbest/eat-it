import React, { useState, useContext, useEffect, useCallback } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { ModalCategory } from 'lib/enums';
import { RecipeSlim, Image } from 'lib/interfaces';
import { useGetRecipeByIdLazyQuery, useDeleteRecipeByIdMutation, useToggleRecipeStarMutation } from 'generated/graphql';
import { FaEdit, FaTrashAlt, FaRegStar, FaStar } from "react-icons/fa";
import gql from 'graphql-tag';
import cloneDeep from '@bit/lodash.lodash.clone-deep'
import { RecipeTag } from './RecipeTag';
import { ProfileContext } from 'pages/Profile';
import { MealsAreaContext } from './MealsArea';
import LazyLoadPic from './LazyLoadPic';
import mealItemStyles from './MealItem.module.css'



interface Props<T> {
    rcpSlm: T
    header: string
    scrollPosition?: any
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

export const MealItem: React.FC<Props<RecipeSlim>> = ({ rcpSlm, scrollPosition }) => {
    const { image, title, id, tags, isStarred } = rcpSlm
    const imgInfo: Image = { src: image, alt: title, width: '90%', caption: title, scrollPosition, style: { display: 'block', cursor: 'pointer' } }
    const [modalType, setModalType] = useState<ModalCategory | undefined>(undefined)
    const { dispatch } = useContext(MealsAreaContext)
    const { me } = useContext(ProfileContext)
    const [getRecipeById, { data }] = useGetRecipeByIdLazyQuery()

    const recipeById = data && data.getRecipeById

    const showModal = useCallback((type: ModalCategory) => {
            if (data && data.getRecipeById) {
                dispatch({
                    type,
                    value: {
                        tags,
                        recipe: data.getRecipeById,
                    }
                })
            }
    }, [data, dispatch, tags])

    useEffect(() => {
        if (modalType && recipeById)
            showModal(modalType)
    }, [recipeById, modalType, showModal])

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

    const handleShowModal = (modalType: ModalCategory) => {
        setModalType(modalType) // so that we know if View or Edit was selected
        getRecipeById({ variables: { id } })
        showModal(modalType)
    }



    const handleStarToggle = () => {
        const starred = !isStarred
        toggleStar({
            variables: {
                userId: me.id,
                recipeId: id,
                isStarred: starred
            },
            update(cache, { data }) {
                if(data && data.toggleRecipeStar)
                    cache.writeQuery({ query: GET_ME_LOCAL, data: { me: data.toggleRecipeStar } })
            }
        })
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete?')) {
            // deleteRecipeById({ variables: { id } })
            deleteRecipeById()
        }
    }

    return (<ListGroup.Item className={mealItemStyles.item}>
        <div className={mealItemStyles.item}>
            <span onClick={() => handleShowModal(ModalCategory.View)} >
                <LazyLoadPic image={imgInfo} />
            </span>
            {/* <span style={{ marginLeft: "3rem" }}> */}
            <span className={mealItemStyles.itemIcons}>
                <FaEdit className={mealItemStyles.pointer} onClick={() => handleShowModal(ModalCategory.Edit)} /> <FaTrashAlt className={mealItemStyles.pointer} onClick={handleDelete} />
                {/* <span style={{ marginLeft: "3rem" }}> */}
                <span>
                    {isStarred ? <FaStar className={mealItemStyles.pointer} onClick={handleStarToggle} /> : <FaRegStar className={mealItemStyles.pointer} onClick={handleStarToggle} />}
                </span>
            </span>
        </div>
        <div style={{ marginTop: '1rem' }}>
            {tags && tags.map(t => <RecipeTag key={t.id} text={t.name} />)}
        </div>
    </ListGroup.Item>)
}
