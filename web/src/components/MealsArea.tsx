import React, { useState } from 'react'
import { MealCategory, ModalCategory } from 'lib/enums'
import { MealCard } from './MealCard'
import { RecipeSlim, Recipe } from 'lib/interfaces'
import { getEnumNames, getKeyByValue } from 'lib/utils'
import CreateRecipeModal from './CreateRecipeModal'
import MainModal from './MainModal'

interface Props {
    recipesSlim: RecipeSlim[] | undefined
    onlyShowStarred: boolean
}

const MealsArea: React.FC<Props> = ({ recipesSlim, onlyShowStarred }) => {
    const [show, setShow] = useState(false)
    const [header, setHeader] = useState('')
    const [modalType, setModalType] = useState<ModalCategory|undefined>(undefined)
    const [recipe, setRecipe] = useState<Recipe|undefined>(undefined)

    const handleClose = () => setShow(false)
    const handleShow = (newHeader: string) => {
        setHeader(newHeader)
        setShow(true)
    }
    
    const params = {show, handleClose, header, type: modalType}


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
            <MainModal params={params}/>
            {/* create a new meal card for each meal of the day */}
            {getEnumNames(MealCategory).map(mealName => {
                const recipesForThisMeal = sortedMeals[mealName]
                return <MealCard key={mealName} header={mealName} setRecipe={setRecipe} setModalType={setModalType} handleShow={handleShow} recipesSlim={recipesForThisMeal} />
            })}
        </div>
    )
}

export default React.memo(MealsArea)