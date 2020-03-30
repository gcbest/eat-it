import React, { useReducer, useContext, useState, useEffect } from 'react'
import { MealCategory, ModalCategory } from 'lib/enums'
import MealCard from './MealCard'
import { RecipeSlim, ModalInterface, ReducerAction, Recipe } from 'lib/interfaces'
import { getEnumNames, getKeyByValue } from 'lib/utils'
import MainModal from './MainModal'
import { ProfileContext } from 'pages/Profile'
import { useScrollPosition } from '../lib/useScrollPosition'
import { GetRecipeByIdQuery } from 'generated/graphql'
import './MealsArea.css'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

interface Props {
    recipesSlim: RecipeSlim[] | undefined
    onlyShowStarred: boolean
    recipeData?: GetRecipeByIdQuery | { getRecipeById: Recipe }
    // recipeData?: any
}

const CLOSE_MODAL = 'CLOSE_MODAL'

const initialState: ModalInterface = {
    show: false,
    modalType: undefined,
    recipe: undefined,
}

const reducer = (state: ModalInterface, action: ReducerAction) => {
    state = { ...state, show: true } // show the modal for all types
    const { type, value } = action // value includes ModalInterface props (recipe, mealType, tags)
    switch (type) {
        case ModalCategory.Create:
            return { ...state, modalType: ModalCategory.Create, ...value }
        case ModalCategory.View:
            return { ...state, modalType: ModalCategory.View, ...value }
        case ModalCategory.Edit:
            return { ...state, modalType: ModalCategory.Edit, ...value }
        case CLOSE_MODAL:
            return initialState
        default:
            return { ...state, show: false }
    }
}

export const MealsAreaContext = React.createContext<any>(undefined)

const MealsArea: React.FC<Props> = ({ recipesSlim = [], onlyShowStarred, recipeData }) => {
    const { me } = useContext(ProfileContext)

    const [params, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        if (!recipeData)
            return;

        const { getRecipeById: recipe } = recipeData
        dispatch({
            type: ModalCategory.View,
            value: { recipe }
        })
    }, [recipeData])


    const handleClose = () => dispatch({ type: CLOSE_MODAL })

    const [currPos, setCurrPos] = useState({ x: null, y: null })

    useScrollPosition(({ currPos }: { currPos: any }) => {
        const { x, y } = currPos
        setCurrPos({ x, y })
    })
    // const handleShow = (newHeader: string) => {
    //     setHeader(newHeader)
    //     setShow(true)
    // }

    // const params = {show, handleClose, header, type: modalType}


    // create an object w/ {Breakfast: [], Lunch: [], ...}
    const sortedMeals: any = getEnumNames(MealCategory).reduce((acc, currentMealName) => {
        return { ...acc, [currentMealName]: [] }
    }, {})

    // push each recipe into designated meal object {Breakfast: [{title: 'eggs & bacon'}]}
    recipesSlim.forEach(rcpSlm => {
        const mealName = getKeyByValue(MealCategory, rcpSlm.mealType)

        if (onlyShowStarred) {
            if (rcpSlm.isStarred)
                sortedMeals[mealName!].push(rcpSlm)
        }
        else {
            sortedMeals[mealName!].push(rcpSlm)
        }
    })

    return (
        <div className="mealsArea">
            {console.log(params)}
            {params.show && <MainModal params={params} handleClose={handleClose} me={me} />}

            <MealsAreaContext.Provider value={{ dispatch, currPos }}>
                {/* create a new meal card for each meal of the day */}
                {getEnumNames(MealCategory).map(mealName => {
                    const recipesForThisMeal = sortedMeals[mealName]
                    const mealType = getKeyByValue(MealCategory, mealName)
                    // return <MealCard key={mealName} header={mealName} setRecipe={setRecipe} setModalType={setModalType} handleShow={handleShow} recipesSlim={recipesForThisMeal} />
                    return <MealCard key={mealName} mealType={parseInt(mealType!)} recipesSlim={recipesForThisMeal} />
                })}
            </MealsAreaContext.Provider>
        </div>
    )
}

export default React.memo(MealsArea)