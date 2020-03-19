import React, { useState, useReducer, useContext } from 'react'
import { MealCategory, ModalCategory } from 'lib/enums'
import { MealCard } from './MealCard'
import { RecipeSlim, Recipe, ModalInterface, ReducerAction } from 'lib/interfaces'
import { getEnumNames, getKeyByValue } from 'lib/utils'
import CreateRecipeModal from './CreateRecipeModal'
import MainModal from './MainModal'
import { ProfileContext } from 'pages/Profile'

interface Props {
    recipesSlim: RecipeSlim[] | undefined
    onlyShowStarred: boolean
}

const CLOSE_MODAL = 'CLOSE_MODAL'

const initialState: ModalInterface = {
    show: false,
    header: '',
    modalType: undefined,
    recipe: undefined,
}

const reducer = (state: ModalInterface, action: ReducerAction) => {
    state = {...state, show: true} // show the modal for all types
    const {type, value} = action
    switch(type) {
        case ModalCategory.Create:
            return {...state, modalType: ModalCategory.Create, ...value}
        case ModalCategory.View:
            return {...state, modalType: ModalCategory.View, ...value}
        case ModalCategory.Edit:
            return {...state, modalType: ModalCategory.Edit, ...value}
        case CLOSE_MODAL:
            return initialState
        default:
            return {...state, show: false}
    }
}

export const MealsAreaContext = React.createContext<any>(undefined)

const MealsArea: React.FC<Props> = ({ recipesSlim, onlyShowStarred }) => {
    // const [show, setShow] = useState(false)
    // const [header, setHeader] = useState('')
    // const [modalType, setModalType] = useState<ModalCategory|undefined>(undefined)
    // const [recipe, setRecipe] = useState<Recipe|undefined>(undefined)

    const {me} = useContext(ProfileContext)

    const [params, dispatch] = useReducer(reducer, initialState)

    const handleClose = () => dispatch({type: CLOSE_MODAL})
    // const handleShow = (newHeader: string) => {
    //     setHeader(newHeader)
    //     setShow(true)
    // }
    
    // const params = {show, handleClose, header, type: modalType}


    // create an object w/ {Breakfast: [], Lunch: [], ...}
    const sortedMeals: any = getEnumNames(MealCategory).reduce((acc, currentMealName) => {
        return { ...acc, [currentMealName]: [] }
    }, {})

    if (recipesSlim === undefined || (Array.isArray(recipesSlim) && recipesSlim.length < 1))
        return null

    // push each recipe into designated meal object {Breakfast: [{title: 'eggs & bacon'}]}
    recipesSlim.forEach(rcpSlm => {
        const mealName = getKeyByValue(MealCategory, rcpSlm.mealType)

        if(onlyShowStarred) {
            if(rcpSlm.isStarred)
                sortedMeals[mealName!].push(rcpSlm)
        } 
        else {
            sortedMeals[mealName!].push(rcpSlm)
        }
            
    })

    return (
        <div>

            {/* <CreateRecipeModal show={show} handleClose={handleClose} options={{ header }} /> */}
            <MainModal params={params} handleClose={handleClose} me={me}/>
            <MealsAreaContext.Provider value={{dispatch}}>

            {/* create a new meal card for each meal of the day */}
            {getEnumNames(MealCategory).map(mealName => {
                const recipesForThisMeal = sortedMeals[mealName]
                // return <MealCard key={mealName} header={mealName} setRecipe={setRecipe} setModalType={setModalType} handleShow={handleShow} recipesSlim={recipesForThisMeal} />
                return <MealCard key={mealName} header={mealName} recipesSlim={recipesForThisMeal} />
            })}
            </MealsAreaContext.Provider>
        </div>
    )
}

export default React.memo(MealsArea)