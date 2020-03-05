import React, { useEffect, useState, useReducer } from 'react'
import { MealCategory } from 'lib/enums'
import { MealCard } from './MealCard'
import { RecipeSlim } from 'lib/interfaces'
import { getEnumNames, getKeyByValue } from 'lib/utils'

interface Props {
    recipesSlim: RecipeSlim[] | undefined
}

export const MealsArea: React.FC<Props> = ({ recipesSlim }) => {

    const sortedMeals: any = getEnumNames(MealCategory).reduce((acc, currentMealName) => {
        return { ...acc, [currentMealName]: [] }
    }, {})

    if (recipesSlim === undefined || (Array.isArray(recipesSlim) && recipesSlim.length < 1))
        return null

    recipesSlim.forEach(rcpSlm => {
        const mealName = getKeyByValue(MealCategory, rcpSlm.mealType)
        sortedMeals[mealName!].push(rcpSlm)
    })

    return (
        <div>
            {getEnumNames(MealCategory).map(mealName => {
                const recipesForThisMeal = sortedMeals[mealName]
                return <MealCard key={mealName} header={mealName} recipesSlim={recipesForThisMeal} />
            })}
        </div>
    )
}
