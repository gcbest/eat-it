import React, { useState, useEffect, useContext } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form';
import { trackWindowScroll, LazyComponentProps }
    from 'react-lazy-load-image-component';
import { RecipeSlim } from 'lib/interfaces';
import { MealItem } from './MealItem';
import { ModalCategory, MealCategory } from 'lib/enums';
import { Tag } from 'react-tag-autocomplete';
import { MealsAreaContext } from './MealsArea';
import mealCardStyles from './MealCard.module.css'
import CollapsibleCard from './CollapsibleCard/CollapsibleCard';
import Accordion from 'react-bootstrap/Accordion';

interface Props extends LazyComponentProps {
    mealType: MealCategory
    recipesSlim: RecipeSlim[]
}

const MealCard: React.FC<Props> = ({ mealType, recipesSlim }) => {
    const header = MealCategory[mealType]

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
            value: { mealType }
        })
    }

    return (
        <CollapsibleCard defaultActiveKey={header}>
            <Accordion.Toggle as={Card.Header} eventKey={header}>
                {header}
            </Accordion.Toggle>
            <Card.Body className={mealCardStyles.cardContainer}>
                <Card.Title>
                    {recipesSlim && recipesSlim.length > 0 ?
                        <Form>
                            <Form.Group controlId={`${header}Filter`}>
                                <Form.Control name={`${header}Query`} value={searchTerm} onChange={handleFilter} placeholder='Filter Recipes'>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                        :
                        'No Recipes for this Meal'
                    }
                </Card.Title>
                <Accordion.Collapse eventKey={header}>
                    <ListGroup className={mealCardStyles.cardItems}>
                        {searchResults &&
                            searchResults.map(rcpSlm => <MealItem key={rcpSlm.id} rcpSlm={rcpSlm} header={header} scrollPosition={scrollPosition} />)}
                    </ListGroup>
                </Accordion.Collapse>
            </Card.Body>
            <Card.Footer>
                <Button onClick={showCreateModal}>Add New</Button>
            </Card.Footer>
        </CollapsibleCard>
    )
}

export default trackWindowScroll(MealCard)