import React, { useState, useRef } from 'react'
import gql from 'graphql-tag';
import { DiscoveryResults } from 'components/DiscoveryResults'
import { SpinnerComponent } from 'components/Spinner'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import hasIn from '@bit/lodash.lodash.has-in'
import { Recipe } from 'lib/interfaces'
import { useLazyQuery } from '@apollo/react-hooks'
import { ModalInterface } from '../lib/interfaces'
import { useAddRecipeMutation, AddRecipeInput, useMeLocalQuery, useMeLocalLazyQuery } from 'generated/graphql';

export const DiscoverContext = React.createContext<any>(undefined)

const Discover: React.FC = () => {
    const queryRef = useRef<HTMLInputElement>(null);

    const [hasSearched, setHasSearched] = useState(false)
    const { data: user, loading: loadingLocal } = useMeLocalQuery()


    const [getRandomRecipes, { loading, data }] = useLazyQuery(gql`
        query randomRecipes($tags: String!, $number: Float!) {
        randomRecipes(tags: $tags, number: $number) {
            id
            title
            readyInMinutes
            servings
            image
            summary
            sourceUrl
            extendedIngredients
            analyzedInstructions
            dishTypes
        }
        }
    `);

    // const [getMeLocal, { data: dataLocal, loading: loadingLocal }] = useMeLocalLazyQuery()
    // const { data: dataLocal, loading: loadingLocal } = useMeLocalQuery()

    // if (loadingLocal)
    //     console.log('loading local');

    // if (dataLocal)
    //     console.log(dataLocal);

    const [addRecipe] = useAddRecipeMutation()

    const handleSearch = async () => {
        setHasSearched(true)
        try {
            if (queryRef !== null && queryRef.current !== null) {
                getRandomRecipes({
                    variables: {
                        tags: queryRef.current.value.toLowerCase(),
                        number: 1
                    }
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    // const data: { randomRecipes: any[] } = { randomRecipes: [] }
    // data.randomRecipes = [{
    //     "vegetarian": true,
    //     "vegan": false,
    //     "glutenFree": false,
    //     "dairyFree": false,
    //     "veryHealthy": false,
    //     "cheap": false,
    //     "veryPopular": false,
    //     "sustainable": false,
    //     "weightWatcherSmartPoints": 7,
    //     "gaps": "no",
    //     "lowFodmap": false,
    //     "preparationMinutes": 20,
    //     "cookingMinutes": 50,
    //     "sourceUrl": "http://www.pinkwhen.com/cinnamon-nut-squares/",
    //     "spoonacularSourceUrl": "https://spoonacular.com/cinnamon-nut-squares-715389",
    //     "aggregateLikes": 43,
    //     "spoonacularScore": 12,
    //     "healthScore": 0,
    //     "creditsText": "Jen West",
    //     "license": "CC BY-SA 3.0",
    //     "sourceName": "Pink When",
    //     "pricePerServing": 26.01,
    //     "extendedIngredients": [
    //         {
    //             "id": 1001,
    //             "aisle": "Milk, Eggs, Other Dairy",
    //             "image": "butter-sliced.jpg",
    //             "consitency": "solid",
    //             "name": "butter",
    //             "original": "1 cup softened butter",
    //             "originalString": "1 cup softened butter",
    //             "originalName": "softened butter",
    //             "amount": 1,
    //             "unit": "cup",
    //             "meta": [
    //                 "softened"
    //             ],
    //             "metaInformation": [
    //                 "softened"
    //             ],
    //             "measures": {
    //                 "us": {
    //                     "amount": 1,
    //                     "unitShort": "cup",
    //                     "unitLong": "cup"
    //                 },
    //                 "metric": {
    //                     "amount": 236.588,
    //                     "unitShort": "ml",
    //                     "unitLong": "milliliters"
    //                 }
    //             }
    //         },
    //         {
    //             "id": 1001,
    //             "aisle": "Milk, Eggs, Other Dairy",
    //             "image": "butter-sliced.jpg",
    //             "consitency": "solid",
    //             "name": "butter",
    //             "original": "1 teaspoon vanilla or butter vanilla bakery emulsion",
    //             "originalString": "1 teaspoon vanilla or butter vanilla bakery emulsion",
    //             "originalName": "vanilla or butter vanilla bakery emulsion",
    //             "amount": 1,
    //             "unit": "teaspoon",
    //             "meta": [],
    //             "metaInformation": [],
    //             "measures": {
    //                 "us": {
    //                     "amount": 1,
    //                     "unitShort": "tsp",
    //                     "unitLong": "teaspoon"
    //                 },
    //                 "metric": {
    //                     "amount": 1,
    //                     "unitShort": "tsp",
    //                     "unitLong": "teaspoon"
    //                 }
    //             }
    //         },
    //         {
    //             "id": 2010,
    //             "aisle": "Spices and Seasonings",
    //             "image": "cinnamon.jpg",
    //             "consitency": "solid",
    //             "name": "cinnamon",
    //             "original": "1 tablespoon cinnamon",
    //             "originalString": "1 tablespoon cinnamon",
    //             "originalName": "cinnamon",
    //             "amount": 1,
    //             "unit": "tablespoon",
    //             "meta": [],
    //             "metaInformation": [],
    //             "measures": {
    //                 "us": {
    //                     "amount": 1,
    //                     "unitShort": "Tbsp",
    //                     "unitLong": "Tbsp"
    //                 },
    //                 "metric": {
    //                     "amount": 1,
    //                     "unitShort": "Tbsp",
    //                     "unitLong": "Tbsp"
    //                 }
    //             }
    //         },
    //         {
    //             "id": 1123,
    //             "aisle": "Milk, Eggs, Other Dairy",
    //             "image": "egg.png",
    //             "consitency": "solid",
    //             "name": "egg",
    //             "original": "1 egg, separated",
    //             "originalString": "1 egg, separated",
    //             "originalName": "egg, separated",
    //             "amount": 1,
    //             "unit": "",
    //             "meta": [
    //                 "separated"
    //             ],
    //             "metaInformation": [
    //                 "separated"
    //             ],
    //             "measures": {
    //                 "us": {
    //                     "amount": 1,
    //                     "unitShort": "",
    //                     "unitLong": ""
    //                 },
    //                 "metric": {
    //                     "amount": 1,
    //                     "unitShort": "",
    //                     "unitLong": ""
    //                 }
    //             }
    //         },
    //         {
    //             "id": 20081,
    //             "aisle": "Baking",
    //             "image": "flour.png",
    //             "consitency": "solid",
    //             "name": "flour",
    //             "original": "2 cups flour",
    //             "originalString": "2 cups flour",
    //             "originalName": "flour",
    //             "amount": 2,
    //             "unit": "cups",
    //             "meta": [],
    //             "metaInformation": [],
    //             "measures": {
    //                 "us": {
    //                     "amount": 2,
    //                     "unitShort": "cups",
    //                     "unitLong": "cups"
    //                 },
    //                 "metric": {
    //                     "amount": 473.176,
    //                     "unitShort": "ml",
    //                     "unitLong": "milliliters"
    //                 }
    //             }
    //         },
    //         {
    //             "id": 12142,
    //             "aisle": "Nuts;Baking",
    //             "image": "pecans.jpg",
    //             "consitency": "solid",
    //             "name": "pecans",
    //             "original": "1 cup chopped pecans",
    //             "originalString": "1 cup chopped pecans",
    //             "originalName": "chopped pecans",
    //             "amount": 1,
    //             "unit": "cup",
    //             "meta": [
    //                 "chopped"
    //             ],
    //             "metaInformation": [
    //                 "chopped"
    //             ],
    //             "measures": {
    //                 "us": {
    //                     "amount": 1,
    //                     "unitShort": "cup",
    //                     "unitLong": "cup"
    //                 },
    //                 "metric": {
    //                     "amount": 236.588,
    //                     "unitShort": "ml",
    //                     "unitLong": "milliliters"
    //                 }
    //             }
    //         },
    //         {
    //             "id": 2047,
    //             "aisle": "Spices and Seasonings",
    //             "image": "salt.jpg",
    //             "consitency": "solid",
    //             "name": "salt",
    //             "original": "½ teaspoon salt",
    //             "originalString": "½ teaspoon salt",
    //             "originalName": "salt",
    //             "amount": 0.5,
    //             "unit": "teaspoon",
    //             "meta": [],
    //             "metaInformation": [],
    //             "measures": {
    //                 "us": {
    //                     "amount": 0.5,
    //                     "unitShort": "tsps",
    //                     "unitLong": "teaspoons"
    //                 },
    //                 "metric": {
    //                     "amount": 0.5,
    //                     "unitShort": "tsps",
    //                     "unitLong": "teaspoons"
    //                 }
    //             }
    //         },
    //         {
    //             "id": 19335,
    //             "aisle": "Baking",
    //             "image": "sugar-in-bowl.png",
    //             "consitency": "solid",
    //             "name": "sugar",
    //             "original": "1 cup sugar",
    //             "originalString": "1 cup sugar",
    //             "originalName": "sugar",
    //             "amount": 1,
    //             "unit": "cup",
    //             "meta": [],
    //             "metaInformation": [],
    //             "measures": {
    //                 "us": {
    //                     "amount": 1,
    //                     "unitShort": "cup",
    //                     "unitLong": "cup"
    //                 },
    //                 "metric": {
    //                     "amount": 236.588,
    //                     "unitShort": "ml",
    //                     "unitLong": "milliliters"
    //                 }
    //             }
    //         }
    //     ],
    //     "id": 715389,
    //     "title": "Cinnamon Nut Squares",
    //     "readyInMinutes": 70,
    //     "servings": 24,
    //     "image": "https://spoonacular.com/recipeImages/715389-556x370.jpg",
    //     "imageType": "jpg",
    //     "summary": "Cinnamon Nut Squares might be just the hor d'oeuvre you are searching for. One serving contains <b>171 calories</b>, <b>2g of protein</b>, and <b>11g of fat</b>. This vegetarian recipe serves 24 and costs <b>26 cents per serving</b>. 43 people have made this recipe and would make it again. A mixture of pecans, salt, cinnamon, and a handful of other ingredients are all it takes to make this recipe so delicious. From preparation to the plate, this recipe takes roughly <b>1 hour and 10 minutes</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 16%</b>. This score is rather bad. Try <a href=\"https://spoonacular.com/recipes/cappuccino-cinnamon-squares-507948\">Cappuccino Cinnamon Squares</a>, <a href=\"https://spoonacular.com/recipes/gooey-cinnamon-squares-591578\">Gooey Cinnamon Squares</a>, and <a href=\"https://spoonacular.com/recipes/cinnamon-orange-squares-233188\">Cinnamon-Orange Squares</a> for similar recipes.",
    //     "cuisines": [],
    //     "dishTypes": [
    //         "antipasti",
    //         "starter",
    //         "snack",
    //         "appetizer",
    //         "antipasto",
    //         "hor d'oeuvre"
    //     ],
    //     "diets": [
    //         "lacto ovo vegetarian"
    //     ],
    //     "occasions": [],
    //     "winePairing": {},
    //     "instructions": "Preheat oven to 300 degrees.Spray an oblong baking pan with baking spray. I used a 14x8x2 pan.Cream butter; gradually add sugar and continue beating until mixture is light and fluffy.Add egg yolk, flour, cinnamon, salt and vanilla. Mix well; dough will be thick.Press dough evenly into prepared pan; crust will not be very thick.Lightly beat egg white and brush over top of dough.Sprinkle nuts evenly over dough and lightly press nuts into dough.Bake about 50 minutes or until edges are golden.Remove from oven and cut into square while still hot. Let cool and remove from pan with a spatula.Store in a tightly covered container; square will keep at a week.",
    //     "analyzedInstructions": [
    //         {
    //             "name": "",
    //             "steps": [
    //                 {
    //                     "number": 1,
    //                     "step": "Preheat oven to 300 degrees.Spray an oblong baking pan with baking spray. I used a 14x8x2 pan.Cream butter; gradually add sugar and continue beating until mixture is light and fluffy.",
    //                     "ingredients": [
    //                         {
    //                             "id": 1001,
    //                             "name": "butter",
    //                             "image": "butter-sliced.jpg"
    //                         },
    //                         {
    //                             "id": 19335,
    //                             "name": "sugar",
    //                             "image": "sugar-in-bowl.png"
    //                         }
    //                     ],
    //                     "equipment": [
    //                         {
    //                             "id": 404646,
    //                             "name": "baking pan",
    //                             "image": "roasting-pan.jpg"
    //                         },
    //                         {
    //                             "id": 404784,
    //                             "name": "oven",
    //                             "image": "oven.jpg"
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     "number": 2,
    //                     "step": "Add egg yolk, flour, cinnamon, salt and vanilla.",
    //                     "ingredients": [
    //                         {
    //                             "id": 2010,
    //                             "name": "cinnamon",
    //                             "image": "cinnamon.jpg"
    //                         },
    //                         {
    //                             "id": 20081,
    //                             "name": "all purpose flour",
    //                             "image": "flour.png"
    //                         },
    //                         {
    //                             "id": 2047,
    //                             "name": "salt",
    //                             "image": "salt.jpg"
    //                         }
    //                     ],
    //                     "equipment": []
    //                 },
    //                 {
    //                     "number": 3,
    //                     "step": "Mix well; dough will be thick.Press dough evenly into prepared pan; crust will not be very thick.Lightly beat egg white and brush over top of dough.Sprinkle nuts evenly over dough and lightly press nuts into dough.",
    //                     "ingredients": [],
    //                     "equipment": [
    //                         {
    //                             "id": 404645,
    //                             "name": "frying pan",
    //                             "image": "pan.png"
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     "number": 4,
    //                     "step": "Bake about 50 minutes or until edges are golden.",
    //                     "ingredients": [],
    //                     "equipment": [],
    //                     "length": {
    //                         "number": 50,
    //                         "unit": "minutes"
    //                     }
    //                 },
    //                 {
    //                     "number": 5,
    //                     "step": "Remove from oven and cut into square while still hot.",
    //                     "ingredients": [],
    //                     "equipment": [
    //                         {
    //                             "id": 404784,
    //                             "name": "oven",
    //                             "image": "oven.jpg"
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     "number": 6,
    //                     "step": "Let cool and remove from pan with a spatula.Store in a tightly covered container; square will keep at a week.",
    //                     "ingredients": [],
    //                     "equipment": [
    //                         {
    //                             "id": 404642,
    //                             "name": "spatula",
    //                             "image": "spatula-or-turner.jpg"
    //                         },
    //                         {
    //                             "id": 404645,
    //                             "name": "frying pan",
    //                             "image": "pan.png"
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // }, {
    //     "vegetarian": true,
    //     "vegan": false,
    //     "glutenFree": false,
    //     "dairyFree": false,
    //     "veryHealthy": false,
    //     "cheap": false,
    //     "veryPopular": false,
    //     "sustainable": false,
    //     "weightWatcherSmartPoints": 7,
    //     "gaps": "no",
    //     "lowFodmap": false,
    //     "preparationMinutes": 20,
    //     "cookingMinutes": 50,
    //     "sourceUrl": "http://www.pinkwhen.com/cinnamon-nut-squares/",
    //     "spoonacularSourceUrl": "https://spoonacular.com/cinnamon-nut-squares-715389",
    //     "aggregateLikes": 43,
    //     "spoonacularScore": 12,
    //     "healthScore": 0,
    //     "creditsText": "Jen West",
    //     "license": "CC BY-SA 3.0",
    //     "sourceName": "Pink When",
    //     "pricePerServing": 26.01,
    //     "extendedIngredients": [
    //         {
    //             "id": 1001,
    //             "aisle": "Milk, Eggs, Other Dairy",
    //             "image": "butter-sliced.jpg",
    //             "consitency": "solid",
    //             "name": "butter",
    //             "original": "1 cup softened butter",
    //             "originalString": "1 cup softened butter",
    //             "originalName": "softened butter",
    //             "amount": 1,
    //             "unit": "cup",
    //             "meta": [
    //                 "softened"
    //             ],
    //             "metaInformation": [
    //                 "softened"
    //             ],
    //             "measures": {
    //                 "us": {
    //                     "amount": 1,
    //                     "unitShort": "cup",
    //                     "unitLong": "cup"
    //                 },
    //                 "metric": {
    //                     "amount": 236.588,
    //                     "unitShort": "ml",
    //                     "unitLong": "milliliters"
    //                 }
    //             }
    //         },
    //         {
    //             "id": 1001,
    //             "aisle": "Milk, Eggs, Other Dairy",
    //             "image": "butter-sliced.jpg",
    //             "consitency": "solid",
    //             "name": "butter",
    //             "original": "1 teaspoon vanilla or butter vanilla bakery emulsion",
    //             "originalString": "1 teaspoon vanilla or butter vanilla bakery emulsion",
    //             "originalName": "vanilla or butter vanilla bakery emulsion",
    //             "amount": 1,
    //             "unit": "teaspoon",
    //             "meta": [],
    //             "metaInformation": [],
    //             "measures": {
    //                 "us": {
    //                     "amount": 1,
    //                     "unitShort": "tsp",
    //                     "unitLong": "teaspoon"
    //                 },
    //                 "metric": {
    //                     "amount": 1,
    //                     "unitShort": "tsp",
    //                     "unitLong": "teaspoon"
    //                 }
    //             }
    //         },
    //         {
    //             "id": 2010,
    //             "aisle": "Spices and Seasonings",
    //             "image": "cinnamon.jpg",
    //             "consitency": "solid",
    //             "name": "cinnamon",
    //             "original": "1 tablespoon cinnamon",
    //             "originalString": "1 tablespoon cinnamon",
    //             "originalName": "cinnamon",
    //             "amount": 1,
    //             "unit": "tablespoon",
    //             "meta": [],
    //             "metaInformation": [],
    //             "measures": {
    //                 "us": {
    //                     "amount": 1,
    //                     "unitShort": "Tbsp",
    //                     "unitLong": "Tbsp"
    //                 },
    //                 "metric": {
    //                     "amount": 1,
    //                     "unitShort": "Tbsp",
    //                     "unitLong": "Tbsp"
    //                 }
    //             }
    //         },
    //         {
    //             "id": 1123,
    //             "aisle": "Milk, Eggs, Other Dairy",
    //             "image": "egg.png",
    //             "consitency": "solid",
    //             "name": "egg",
    //             "original": "1 egg, separated",
    //             "originalString": "1 egg, separated",
    //             "originalName": "egg, separated",
    //             "amount": 1,
    //             "unit": "",
    //             "meta": [
    //                 "separated"
    //             ],
    //             "metaInformation": [
    //                 "separated"
    //             ],
    //             "measures": {
    //                 "us": {
    //                     "amount": 1,
    //                     "unitShort": "",
    //                     "unitLong": ""
    //                 },
    //                 "metric": {
    //                     "amount": 1,
    //                     "unitShort": "",
    //                     "unitLong": ""
    //                 }
    //             }
    //         },
    //         {
    //             "id": 20081,
    //             "aisle": "Baking",
    //             "image": "flour.png",
    //             "consitency": "solid",
    //             "name": "flour",
    //             "original": "2 cups flour",
    //             "originalString": "2 cups flour",
    //             "originalName": "flour",
    //             "amount": 2,
    //             "unit": "cups",
    //             "meta": [],
    //             "metaInformation": [],
    //             "measures": {
    //                 "us": {
    //                     "amount": 2,
    //                     "unitShort": "cups",
    //                     "unitLong": "cups"
    //                 },
    //                 "metric": {
    //                     "amount": 473.176,
    //                     "unitShort": "ml",
    //                     "unitLong": "milliliters"
    //                 }
    //             }
    //         },
    //         {
    //             "id": 12142,
    //             "aisle": "Nuts;Baking",
    //             "image": "pecans.jpg",
    //             "consitency": "solid",
    //             "name": "pecans",
    //             "original": "1 cup chopped pecans",
    //             "originalString": "1 cup chopped pecans",
    //             "originalName": "chopped pecans",
    //             "amount": 1,
    //             "unit": "cup",
    //             "meta": [
    //                 "chopped"
    //             ],
    //             "metaInformation": [
    //                 "chopped"
    //             ],
    //             "measures": {
    //                 "us": {
    //                     "amount": 1,
    //                     "unitShort": "cup",
    //                     "unitLong": "cup"
    //                 },
    //                 "metric": {
    //                     "amount": 236.588,
    //                     "unitShort": "ml",
    //                     "unitLong": "milliliters"
    //                 }
    //             }
    //         },
    //         {
    //             "id": 2047,
    //             "aisle": "Spices and Seasonings",
    //             "image": "salt.jpg",
    //             "consitency": "solid",
    //             "name": "salt",
    //             "original": "½ teaspoon salt",
    //             "originalString": "½ teaspoon salt",
    //             "originalName": "salt",
    //             "amount": 0.5,
    //             "unit": "teaspoon",
    //             "meta": [],
    //             "metaInformation": [],
    //             "measures": {
    //                 "us": {
    //                     "amount": 0.5,
    //                     "unitShort": "tsps",
    //                     "unitLong": "teaspoons"
    //                 },
    //                 "metric": {
    //                     "amount": 0.5,
    //                     "unitShort": "tsps",
    //                     "unitLong": "teaspoons"
    //                 }
    //             }
    //         },
    //         {
    //             "id": 19335,
    //             "aisle": "Baking",
    //             "image": "sugar-in-bowl.png",
    //             "consitency": "solid",
    //             "name": "sugar",
    //             "original": "1 cup sugar",
    //             "originalString": "1 cup sugar",
    //             "originalName": "sugar",
    //             "amount": 1,
    //             "unit": "cup",
    //             "meta": [],
    //             "metaInformation": [],
    //             "measures": {
    //                 "us": {
    //                     "amount": 1,
    //                     "unitShort": "cup",
    //                     "unitLong": "cup"
    //                 },
    //                 "metric": {
    //                     "amount": 236.588,
    //                     "unitShort": "ml",
    //                     "unitLong": "milliliters"
    //                 }
    //             }
    //         }
    //     ],
    //     "id": 715389,
    //     "title": "Cinnamon Nut Squares",
    //     "readyInMinutes": 70,
    //     "servings": 24,
    //     "image": "https://spoonacular.com/recipeImages/715389-556x370.jpg",
    //     "imageType": "jpg",
    //     "summary": "Cinnamon Nut Squares might be just the hor d'oeuvre you are searching for. One serving contains <b>171 calories</b>, <b>2g of protein</b>, and <b>11g of fat</b>. This vegetarian recipe serves 24 and costs <b>26 cents per serving</b>. 43 people have made this recipe and would make it again. A mixture of pecans, salt, cinnamon, and a handful of other ingredients are all it takes to make this recipe so delicious. From preparation to the plate, this recipe takes roughly <b>1 hour and 10 minutes</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 16%</b>. This score is rather bad. Try <a href=\"https://spoonacular.com/recipes/cappuccino-cinnamon-squares-507948\">Cappuccino Cinnamon Squares</a>, <a href=\"https://spoonacular.com/recipes/gooey-cinnamon-squares-591578\">Gooey Cinnamon Squares</a>, and <a href=\"https://spoonacular.com/recipes/cinnamon-orange-squares-233188\">Cinnamon-Orange Squares</a> for similar recipes.",
    //     "cuisines": [],
    //     "dishTypes": [
    //         "antipasti",
    //         "starter",
    //         "snack",
    //         "appetizer",
    //         "antipasto",
    //         "hor d'oeuvre"
    //     ],
    //     "diets": [
    //         "lacto ovo vegetarian"
    //     ],
    //     "occasions": [],
    //     "winePairing": {},
    //     "instructions": "Preheat oven to 300 degrees.Spray an oblong baking pan with baking spray. I used a 14x8x2 pan.Cream butter; gradually add sugar and continue beating until mixture is light and fluffy.Add egg yolk, flour, cinnamon, salt and vanilla. Mix well; dough will be thick.Press dough evenly into prepared pan; crust will not be very thick.Lightly beat egg white and brush over top of dough.Sprinkle nuts evenly over dough and lightly press nuts into dough.Bake about 50 minutes or until edges are golden.Remove from oven and cut into square while still hot. Let cool and remove from pan with a spatula.Store in a tightly covered container; square will keep at a week.",
    //     "analyzedInstructions": [
    //         {
    //             "name": "",
    //             "steps": [
    //                 {
    //                     "number": 1,
    //                     "step": "Preheat oven to 300 degrees.Spray an oblong baking pan with baking spray. I used a 14x8x2 pan.Cream butter; gradually add sugar and continue beating until mixture is light and fluffy.",
    //                     "ingredients": [
    //                         {
    //                             "id": 1001,
    //                             "name": "butter",
    //                             "image": "butter-sliced.jpg"
    //                         },
    //                         {
    //                             "id": 19335,
    //                             "name": "sugar",
    //                             "image": "sugar-in-bowl.png"
    //                         }
    //                     ],
    //                     "equipment": [
    //                         {
    //                             "id": 404646,
    //                             "name": "baking pan",
    //                             "image": "roasting-pan.jpg"
    //                         },
    //                         {
    //                             "id": 404784,
    //                             "name": "oven",
    //                             "image": "oven.jpg"
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     "number": 2,
    //                     "step": "Add egg yolk, flour, cinnamon, salt and vanilla.",
    //                     "ingredients": [
    //                         {
    //                             "id": 2010,
    //                             "name": "cinnamon",
    //                             "image": "cinnamon.jpg"
    //                         },
    //                         {
    //                             "id": 20081,
    //                             "name": "all purpose flour",
    //                             "image": "flour.png"
    //                         },
    //                         {
    //                             "id": 2047,
    //                             "name": "salt",
    //                             "image": "salt.jpg"
    //                         }
    //                     ],
    //                     "equipment": []
    //                 },
    //                 {
    //                     "number": 3,
    //                     "step": "Mix well; dough will be thick.Press dough evenly into prepared pan; crust will not be very thick.Lightly beat egg white and brush over top of dough.Sprinkle nuts evenly over dough and lightly press nuts into dough.",
    //                     "ingredients": [],
    //                     "equipment": [
    //                         {
    //                             "id": 404645,
    //                             "name": "frying pan",
    //                             "image": "pan.png"
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     "number": 4,
    //                     "step": "Bake about 50 minutes or until edges are golden.",
    //                     "ingredients": [],
    //                     "equipment": [],
    //                     "length": {
    //                         "number": 50,
    //                         "unit": "minutes"
    //                     }
    //                 },
    //                 {
    //                     "number": 5,
    //                     "step": "Remove from oven and cut into square while still hot.",
    //                     "ingredients": [],
    //                     "equipment": [
    //                         {
    //                             "id": 404784,
    //                             "name": "oven",
    //                             "image": "oven.jpg"
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     "number": 6,
    //                     "step": "Let cool and remove from pan with a spatula.Store in a tightly covered container; square will keep at a week.",
    //                     "ingredients": [],
    //                     "equipment": [
    //                         {
    //                             "id": 404642,
    //                             "name": "spatula",
    //                             "image": "spatula-or-turner.jpg"
    //                         },
    //                         {
    //                             "id": 404645,
    //                             "name": "frying pan",
    //                             "image": "pan.png"
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // }]

    return (
        // <Container>
        //     <Row>
        //         <Col>
        <DiscoverContext.Provider value={{me: user ? user.me : null}}>

                    <InputGroup className="mb-3">
                        <FormControl
                            type="input"
                            placeholder="Recipient's username"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            ref={queryRef as any} // react-bootstrap TS bug
                            />
                        <InputGroup.Append>
                            <Button variant="outline-secondary" onClick={handleSearch}>Discover</Button>
                        </InputGroup.Append>
                    </InputGroup> {
                        loading ?
                        <SpinnerComponent /> :
                        <DiscoveryResults recipes={data && data.randomRecipes ? data.randomRecipes : null} hasSearched={hasSearched} />
                    }
        </DiscoverContext.Provider>
        //         </Col>
        //     </Row>
        // </Container>
    )
}

export default Discover