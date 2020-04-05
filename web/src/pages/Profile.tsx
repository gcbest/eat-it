import React, { useState, Fragment, useEffect } from "react";
import { useGetRecipeByIdLazyQuery, useMeQuery } from "../generated/graphql";
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'
import MealsArea from "components/MealsArea";
import Downshift from 'downshift';
import { DropDown, DropDownItem, SearchStyles } from '../styles/Dropdown';
import { ApolloConsumer, useLazyQuery } from "@apollo/react-hooks";
import debounce from 'lodash.debounce';
import { FaStar, FaRegStar, FaShoppingCart, FaDice } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { RecipeSlim } from "lib/interfaces";
import SlidingPane from "components/SlidingPane/SlidingPane";
import ShoppingCart from "components/ShoppingCart/ShoppingCart";
import { GET_CART_ITEMS_BY_USER_ID } from "graphql/queriesAndMutations";
import Container from "react-bootstrap/Container";
import profileStyles from '../styles/Profile.module.css'


export const ProfileContext = React.createContext<any>(undefined)

const Profile: React.FC<RouteComponentProps> = ({ history }) => {
  const { data: userData, loading, error } = useMeQuery();
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [showRecipeModal, setShowRecipeModal] = useState(false) // to prevent modal from always showing when recipeData exists
  const [showCart, setShowCart] = useState(false)
  const [recipes, setRecipes] = useState<RecipeSlim[]>([])
  const [onlyShowStarred, setOnlyShowStarred] = useState(false)
  let [getRecipeById, { data: recipeData }] = useGetRecipeByIdLazyQuery()
  const [getCartItems, { loading: cartItemsLoading, error: cartItemsError, data: cartItemsData }] = useLazyQuery(GET_CART_ITEMS_BY_USER_ID)
  const hasRecipes = userData && userData.me && userData.me.recipes && userData.me.recipes.length > 0

  if (loading)
    return <div>loading...</div>;

  // DOWNSHIFT 
  const handleShowRecipe = (id: number) => {
    getRecipeById({ variables: { id } })
    setShowRecipeModal(true)
  }

  const displayRecipe = (item: RecipeSlim | null) => {
    if (!item)
      return setShowRecipeModal(false)

    return handleShowRecipe(item.id)
  }

  const onSearchChange = debounce((e: any) => {
    console.log('Searching...');
    // turn loading on
    setShowRecipeModal(false)
    setLoadingSearch(true)

    // filter
    if (userData && userData.me && userData.me.recipes) {
      const filteredRecipes = userData.me.recipes.filter((recipeSlim: RecipeSlim) => {
        return recipeSlim.title.trim().toLowerCase().includes(e.target.value.trim().toLowerCase())
      })
      setRecipes(filteredRecipes)
    }
    setLoadingSearch(false)
  }, 350)
  ////////////////////////

  const handleStarToggle = () => {
    setShowRecipeModal(false)
    setOnlyShowStarred(!onlyShowStarred)
  }

  const handleGetAnyRecipe = () => {
    if (!(userData && userData.me && userData.me.recipes && userData.me.recipes.length > 0))
      return console.error('No recipes found on user to randomly select one');

    const recipesArr = userData.me.recipes
    const randomlySelectedRecipe = recipesArr[Math.floor(Math.random() * recipesArr.length)]
    handleShowRecipe(randomlySelectedRecipe.id)
  }


  // SHOPPING CART 
  const handleCartToggle = () => {
    setShowRecipeModal(false)
    if (userData && userData.me && userData.me.id)
      getCartItems({ variables: { id: userData.me.id } })
    setShowCart(!showCart)
  }
  /////////////////////////

  // TODO: set error name to check if not logged in
  // if (error && error.name === 'userNotFound') {
  if (error) {
    history.push('/register')
  }

  if (error) {
    console.error(error);
    return <div>Something went wrong!</div>;
  }

  if(!userData || !userData.me)
    return <Redirect to="/login" push={true} />

  // size buttons based on window width
  const btnProp: {size?: 'lg' | 'sm'} = {}
  if(window.innerWidth > 900)
    btnProp.size = 'lg'

  return (
    <div className={profileStyles.background}>
      <Container>
        <ProfileContext.Provider value={{ me: userData.me }}>
          <SearchStyles>
            <Downshift 
              itemToString={(item: any) => (item === null ? '' : item.title)}
              onSelect={displayRecipe}>
              {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
                <div>
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
                        !loading && <DropDownItem> Nothing Found: {inputValue}</DropDownItem>}
                    </DropDown>
                  )}
                </div>
              )}
            </Downshift>
          </SearchStyles>
          <div className={profileStyles.actionButtons}>
            {hasRecipes ?
              <Fragment>
                <Button {...btnProp} onClick={handleStarToggle}>{!onlyShowStarred ? <span>Starred <FaStar /></span> : <span>All <FaRegStar /></span>}</Button>
                <Button {...btnProp} onClick={handleGetAnyRecipe}>Random <FaDice /></Button>
              </Fragment>
              : null
            }
            <Button {...btnProp} onClick={handleCartToggle}>Cart <FaShoppingCart /></Button>
          </div>
          <SlidingPane isOpen={showCart} onRequestClose={handleCartToggle} title="Shopping Cart" children={<ShoppingCart items={cartItemsData ? cartItemsData.getCartItemsByUserId : []} />} />
          {/* create new object for recipeData so that componentShouldUpdate is triggered in MealsArea's useEffect  */}
          <MealsArea recipesSlim={userData.me.recipes} onlyShowStarred={onlyShowStarred} recipeData={showRecipeModal && recipeData ? { ...recipeData } : undefined} />
        </ProfileContext.Provider>
      </Container>
    </div>
  )
};

export default Profile