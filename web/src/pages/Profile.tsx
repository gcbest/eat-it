import React, { useState } from "react";
import { useMeLocalQuery, useGetRecipeByIdLazyQuery } from "../generated/graphql";
import { Redirect, RouteComponentProps, Link } from 'react-router-dom'
import { MealsArea } from "components/MealsArea";
// import { User } from "lib/interfaces";
import Downshift, { resetIdCounter } from 'downshift';
import { DropDown, DropDownItem, SearchStyles } from '../styles/Dropdown';
import debounce from 'lodash.debounce';
import { ApolloConsumer } from "@apollo/react-hooks";
import { ModalCategory } from "lib/enums";
import { ViewRecipeModal } from "components/ViewRecipeModal";
import { RecipeSlim } from "lib/interfaces";


export const ProfileContext = React.createContext<any>(undefined)

export const Profile: React.FC<RouteComponentProps> = ({ history }) => {
  // TODO: createProfileQuery - get user with relations - https://typeorm.io/#/many-to-one-one-to-many-relations
  // const users = await userRepository.find({ relations: ["photos"] });

  const { data, loading, error } = useMeLocalQuery();
  const [search, setSearch] = useState([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [showRecipe, setShowRecipe] = useState(false)
  const [items, setItems] = useState<RecipeSlim[]>([])

  const [getRecipeById, { data: recipeData }] = useGetRecipeByIdLazyQuery()





  // const [load]
  // const {me: {recipes}} = data

  if (loading)
    return <div>loading...</div>;

    // TODO: put onto context
    // const handleShowRecipe = (id: number, setShow: (val: boolean) => void) => {
    const handleShowRecipe = (id: number) => {
        getRecipeById({ variables: { id } })
        setShowRecipe(true)
    }

  const handleCloseRecipe = () => setShowRecipe(false);

  const displayRecipe = (item: any) => {
    handleShowRecipe(item.id)
  }

    const onSearchChange = debounce(async (e, client) => {
      console.log('Searching...');
      // turn loading on
      setLoadingSearch(true)

      // displayRecipe()
      // filter based on user
      if(data && data.me && data.me.recipes) {
        const filteredItems = data.me.recipes.filter(recipe => {
          return recipe.title.trim().toLowerCase().includes(e.target.value.trim().toLowerCase())
        })
        setItems(filteredItems)
      }

      // Manually query apollo client
      // const res = await client.query({
      //   query: SEARCH_ITEMS_QUERY,
      //   variables: { searchTerm: e.target.value },
      // });
      // this.setState({
      //   items: res.data.items,
      //   loading: false,
      // });
      setLoadingSearch(false)
    }, 350);
  // TODO: set error name to check if not logged in
  // if (error && error.name === 'userNotFound') {
  if (error) {
    history.push('/register')
  }

  if (error) {
    console.error(error);
    return <div>Something went wrong!</div>;
  }

  if (!data || !data.me)
    return <div>Profile not found.  <Link to="react-router-dom"> Sign up</Link> for an account today!</div>;


  return (<div>
    <ProfileContext.Provider value={{me: data.me, showRecipe, setShowRecipe}}>
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
                        onSearchChange(e, client);
                      },
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {items.map((item: any, index) => (
                    <DropDownItem
                      {...getItemProps({item})}
                      key={item.id}
                      highlighted={index === highlightedIndex}
                    >
                      <img width="50" src={item.image} alt={item.title} />
                      {item.title}
                    </DropDownItem>
                  ))}
                  {!items.length &&
                    !loading && <DropDownItem> Nothing Found {inputValue}</DropDownItem>}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
      {recipeData && recipeData.getRecipeById ?
            <ViewRecipeModal show={showRecipe} handleClose={handleCloseRecipe} options={{ type: ModalCategory.View }} recipe={recipeData && recipeData.getRecipeById} /> :
            null
        }
      <MealsArea recipesSlim={data.me.recipes} userId={data.me.id} />

    </ProfileContext.Provider>
    </div>)
};

// TODOs:
// Add tags to a recipe
// Use downshift just for general search
// include add button for new meal
// include delete button
// include update to add tags, edit etc
// can choose a random meal from your saved list

// Create CRUD app
// Able to hit spoonacular API and get search results or save a recipe URL
// can add tags to each recipe to sort them
// show lists of different bigger tags like breakfast, lunch, dinner, snack, dessert
// able to filter all at same time
