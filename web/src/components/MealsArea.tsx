import React, { useState } from 'react'
import { MealCategory } from 'lib/enums'
import { MealCard } from './MealCard'
import { RecipeSlim } from 'lib/interfaces'
import { getEnumNames, getKeyByValue } from 'lib/utils'

interface Props {
    recipesSlim: RecipeSlim[] | undefined
    userId: number
}

export const MealsArea: React.FC<Props> = ({ recipesSlim, userId }) => {


    // create an object w/ {Breakfast: [], Lunch: [], ...}
    const sortedMeals: any = getEnumNames(MealCategory).reduce((acc, currentMealName) => {
        return { ...acc, [currentMealName]: [] }
    }, {})

    if (recipesSlim === undefined || (Array.isArray(recipesSlim) && recipesSlim.length < 1))
        return null

    // push each recipe into designated meal object {Breakfast: [{title: 'eggs & bacon'}]}
    recipesSlim.forEach(rcpSlm => {
        const mealName = getKeyByValue(MealCategory, rcpSlm.mealType)
        sortedMeals[mealName!].push(rcpSlm)
    })

    return (
        <div>
            {/* create a new meal card for each meal */}
            {getEnumNames(MealCategory).map(mealName => {
                const recipesForThisMeal = sortedMeals[mealName]
                return <MealCard key={mealName} header={mealName} recipesSlim={recipesForThisMeal} userId={userId} />
            })}
        </div>
    )
}
