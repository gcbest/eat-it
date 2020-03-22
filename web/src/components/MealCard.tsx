import React, { useState, useEffect, useContext } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form';
import { trackWindowScroll, LazyComponentProps }
    from 'react-lazy-load-image-component';
import { RecipeSlim, Recipe, ModalInterface } from 'lib/interfaces';
import { MealItem } from './MealItem';
import { ModalCategory } from 'lib/enums';
// import CreateRecipeModal from './CreateRecipeModal';
import { Tag } from 'react-tag-autocomplete';
import { MealsAreaContext } from './MealsArea';

interface Props extends LazyComponentProps {
    header: string
    recipesSlim: RecipeSlim[]
    // handleShow: (header: string) => void
    // setModalType: (modalType: ModalCategory) => void
    // setRecipe: (recipe: Recipe) => void
}

// export const MealCard: React.FC<Props> = ({ header, recipesSlim, handleShow, setModalType, setRecipe }) => {
const MealCard: React.FC<Props> = ({ header, recipesSlim }) => {
    // const [show, setShow] = useState(false);
    // const handleClose = () => setShow(false);
    // // const handleShow = () => setShow(true);

    // const [recipes, setRecipes] = useState<RecipeSlim[]>([])
    const { dispatch, currPos: scrollPosition } = useContext(MealsAreaContext)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<RecipeSlim[]>([])

    const handleFilter = (e: any) => {
        setSearchTerm(e.target.value)
    }

    useEffect(() => {

        const getTagNames = (tags: Tag[]): string[] => tags.map(t => t.name)
        // check if filter results match
        const results: RecipeSlim[] = recipesSlim.filter(rs => {
            return searchTerm === '' ||
                rs.title.trim().toLowerCase().includes(searchTerm.toLowerCase()) ||
                getTagNames(rs.tags).join(' ').trim().includes(searchTerm.toLowerCase())
        })
        setSearchResults(results)
    }, [searchTerm, recipesSlim])

    const showCreateModal = () => {
        dispatch({
            type: ModalCategory.Create,
            value: { header }
        })
        // setModalType(ModalCategory.Create)
        // handleShow(header)
    }

    // const modalMethods = {
    //     setModalType,
    //     handleShow,
    //     setRecipe
    // }

    return (
        <Card>
            <Card.Header>{header}</Card.Header>
            <Card.Body>
                <Card.Title>
                    <Form>
                        <Form.Group controlId={`${header}Filter`}>
                            <Form.Control name={`${header}Query`} value={searchTerm} onChange={handleFilter} placeholder='Filter Recipes'>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Card.Title>
                <ListGroup>
                    {searchResults &&
                        searchResults.map(rcpSlm => <MealItem key={rcpSlm.id} rcpSlm={rcpSlm} header={header} scrollPosition={scrollPosition} />)}
                    {/* searchResults.map(rcpSlm => <MealItem key={rcpSlm.id} rcpSlm={rcpSlm} header={header} />)} */}
                </ListGroup>
            </Card.Body>
            <Card.Footer>
                <Button onClick={showCreateModal}>Add New</Button>
            </Card.Footer>
        </Card>
    )
}

export default trackWindowScroll(MealCard)