import React, { useState } from 'react'
import { MealCategory } from 'lib/enums'
import { MealCard } from './MealCard'
import { RecipeSlim } from 'lib/interfaces'
import { getEnumNames, getKeyByValue } from 'lib/utils'
import CreateRecipeModal from './CreateRecipeModal'

interface Props {
    recipesSlim: RecipeSlim[] | undefined
    onlyShowStarred: boolean
}

export const MealsArea: React.FC<Props> = ({ recipesSlim, onlyShowStarred }) => {
    const [show, setShow] = useState(false);
    const [header, setHeader] = useState('')
    const handleShow = (newHeader: string) => {
        setHeader(newHeader)
        setShow(true)
    }
    const handleClose = () => setShow(false);


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
            <CreateRecipeModal show={show} handleClose={handleClose} options={{ header }} />

            {/* create a new meal card for each meal */}
            {getEnumNames(MealCategory).map(mealName => {
                const recipesForThisMeal = sortedMeals[mealName]
                return <MealCard key={mealName} header={mealName} handleShow={handleShow} recipesSlim={recipesForThisMeal} />
            })}
        </div>
    )
}

export const MemoizedMealsArea = React.memo(MealsArea)