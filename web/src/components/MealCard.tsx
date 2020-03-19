import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form';
import { RecipeSlim, Recipe } from 'lib/interfaces';
import { MealItem } from './MealItem';
import { ModalCategory } from 'lib/enums';
// import CreateRecipeModal from './CreateRecipeModal';
import { Tag } from 'react-tag-autocomplete';

interface Props {
    header: string
    recipesSlim: RecipeSlim[]
    handleShow: (header: string) => void
    setModalType: (modalType: ModalCategory) => void
    setRecipe: (recipe: Recipe) => void
}

export const MealCard: React.FC<Props> = ({ header, recipesSlim, handleShow, setModalType, setRecipe }) => {
    // const [show, setShow] = useState(false);
    // const handleClose = () => setShow(false);
    // // const handleShow = () => setShow(true);

    // const [recipes, setRecipes] = useState<RecipeSlim[]>([])

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
        setModalType(ModalCategory.Create)
        handleShow(header)
    }

    const modalMethods = {
        setModalType,
        handleShow,
        setRecipe
    }

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
                        searchResults.map(rcpSlm => <MealItem key={rcpSlm.id} rcpSlm={rcpSlm} modalMethods={modalMethods} header={header} />)}
                </ListGroup>
            </Card.Body>
            <Card.Footer>
                <Button onClick={showCreateModal}>Add New</Button>
            </Card.Footer>
        </Card>
    )
}
