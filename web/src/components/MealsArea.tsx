import React, { useEffect } from 'react'
import { MealCategory } from 'lib/enums'
import { MealCard } from './MealCard'
import { RecipeSlim } from 'lib/interfaces'
import { getEnumNames, getKeyByValue } from 'lib/utils'

interface Props {
    recipesSlim: RecipeSlim[]
}

export const MealsArea: React.FC<Props> = ({ recipesSlim }) => {
    // TODO: filter recipesSlim based on Meal type
    const sortedMeals: any = {}
    useEffect(() => {
        // loop thru each MealCategory, create separate empty array for each one 
        getEnumNames(MealCategory).map(mealName => {
            sortedMeals[mealName] = []
        })
        // loop thru recipesSlim and push to corresponding array
        recipesSlim.forEach(rcpSlm => {
            const mealName = getKeyByValue(MealCategory, rcpSlm.mealType)
            sortedMeals[mealName!].push(rcpSlm)
        })
    }, [recipesSlim])

    return (
        <div>
            {getEnumNames(MealCategory).map(mealName => {
                const recipesForThisMeal = sortedMeals[mealName]
                return <MealCard header={mealName} recipesSlim={recipesForThisMeal} />
            })}
        </div>
    )
}
