import React, { useState, useEffect } from "react";
import { useGetRecipeByIdLazyQuery, useMeQuery } from "../generated/graphql";
import { RouteComponentProps, Link } from 'react-router-dom'
import MealsArea from "components/MealsArea";
import Downshift, { resetIdCounter } from 'downshift';
import { DropDown, DropDownItem, SearchStyles } from '../styles/Dropdown';
import { ApolloConsumer, useLazyQuery } from "@apollo/react-hooks";
import { FaStar, FaRegStar, FaShoppingCart, FaDice } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { RecipeSlim } from "lib/interfaces";
import SlidingPane from "components/SlidingPane/SlidingPane";
import ShoppingCart from "components/ShoppingCart/ShoppingCart";
import { GET_CART_ITEMS_BY_USER_ID } from "graphql/queriesAndMutations";

export const ProfileContext = React.createContext<any>(undefined)

const Profile: React.FC<RouteComponentProps> = ({ history }) => {
  const { data: userData, loading, error } = useMeQuery();
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [showRandomRecipe, setShowRandomRecipe] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [recipes, setRecipes] = useState<RecipeSlim[]>([])
  const [onlyShowStarred, setOnlyShowStarred] = useState(false)
  let [getRecipeById, { data: recipeData }] = useGetRecipeByIdLazyQuery()
  const [getCartItems, {loading: cartItemsLoading, error: cartItemsError, data: cartItemsData}] = useLazyQuery(GET_CART_ITEMS_BY_USER_ID)
  const randomlySelectedRecipesArr = []

  useEffect(() => {
    if(recipeData && recipeData.getRecipeById) {
      recipeData.getRecipeById.id = Math.floor(Math.random() * 100)
      recipeData = recipeData
    }
    
  }, [recipeData])

  if (loading)
    return <div>loading...</div>;


  // DOWNSHIFT 
  const handleShowRecipe = (id: number) => {
    getRecipeById({ variables: { id } })
    setShowRandomRecipe(true)
  }

  const displayRecipe = (item: RecipeSlim | null) => {
    if (!item)
      return

    return handleShowRecipe(item.id)
  }

  const onSearchChange = (e: any) => {
    console.log('Searching...');
    // turn loading on
    setLoadingSearch(true)

    // filter
    if (userData && userData.me && userData.me.recipes) {
      const filteredRecipes = userData.me.recipes.filter((recipeSlim: RecipeSlim) => {
        return recipeSlim.title.trim().toLowerCase().includes(e.target.value.trim().toLowerCase())
      })
      setRecipes(filteredRecipes)
    }
    setLoadingSearch(false)
  }
  ////////////////////////

  const handleStarToggle = () => {
    setOnlyShowStarred(!onlyShowStarred)
  }

  const handleGetAnyRecipe = () => {
    if (!userData || !userData.me || !userData.me.recipes)
      return console.error('No recipes found on user to randomly select one');
    
    const recipesArr = userData.me.recipes
    const randomlySelectedRecipe: any = recipesArr[Math.floor(Math.random() * recipesArr.length)]
    // randomlySelectedRecipe.tempId = nanoid(3) // added so that useEffect can be triggered
    console.log(randomlySelectedRecipe.tempId);
    
    handleShowRecipe(randomlySelectedRecipe.id)
  }


  // SHOPPING CART 
  const handleCartToggle = () => {
    if(userData && userData.me && userData.me.id)
      getCartItems({variables: {id: userData.me.id}})
    setShowCart(!showCart)  
  }
  /////////////////////////

  // if(recipeData && recipeData.getRecipeById) {
  // }
  
  
  // TODO: set error name to check if not logged in
  // if (error && error.name === 'userNotFound') {
  if (error) {
    history.push('/register')
  }

  if (error) {
    console.error(error);
    return <div>Something went wrong!</div>;
  }

  if (!userData || !userData.me)
    return <div>Profile not found.  <Link to="react-router-dom"> Sign up</Link> for an account today!</div>;

  return (<div>
    <ProfileContext.Provider value={{ me: userData.me }}>
      <SearchStyles>
        <Downshift onChange={displayRecipe} itemToString={(item: any) => (item === null ? '' : item.title)}>
          {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search For A Recipe',
                      id: 'search',
                      className: loadingSearch ? 'loading' : '',
                      onChange: (e) => {
                        e.persist();
                        onSearchChange(e);
                      },
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {recipes.map((item: any, index) => (
                    <DropDownItem
                      {...getItemProps({ item })}
                      key={item.id}
                      highlighted={index === highlightedIndex}
                    >
                      <img width="50" src={item.image} alt={item.title} />
                      {item.title}
                    </DropDownItem>
                  ))}
                  {!recipes.length &&
                    !loading && <DropDownItem> Nothing Found {inputValue}</DropDownItem>}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
      <Button onClick={handleStarToggle}>{!onlyShowStarred ? <span>Show Starred <FaStar /></span> : <span>Show All <FaRegStar /></span>}</Button>
      <Button onClick={handleGetAnyRecipe}>Show Random <FaDice/></Button>
      <Button onClick={handleCartToggle}><FaShoppingCart/></Button>
      <SlidingPane isOpen={showCart} onRequestClose={handleCartToggle} children={<ShoppingCart items={cartItemsData ? cartItemsData.getCartItemsByUserId : []} />}/>
      {/* create new object for recipeData so that it componentShouldUpdate is triggered in MealsArea's useEffect  */}
      <MealsArea recipesSlim={userData.me.recipes} onlyShowStarred={onlyShowStarred} recipeData={recipeData && {...recipeData}}/> 
    </ProfileContext.Provider>
  </div>)
};

export default Profile