import React, { useState, useContext } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import DiscoverRecipeModal from 'components/DiscoverRecipeModal'
import { FaExternalLinkAlt, FaLayerGroup } from 'react-icons/fa'
import { Recipe } from 'lib/interfaces'
import { DiscoverContext } from 'pages/Discover'
import RecipeCardBody from './RecipeCardBody'

interface Props<T> {
    recipe: T;
}

export const DiscoveryCard: React.FC<Props<Recipe>> = ({ recipe }) => {
    const { sourceUrl } = recipe
    const [show, setShow] = useState(false);
    const { me } = useContext(DiscoverContext)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const params = { show, handleClose, recipe }
    return (
        <Card border="secondary" style={{ margin: '3rem', padding: '1rem', backgroundColor: '#fdfffef5', maxWidth: '25%', boxShadow: 'rgba(204, 204, 204, 0.68) 3px 3px 5px 6px' }}>
            <DiscoverRecipeModal params={params} handleClose={handleClose} />
            <RecipeCardBody recipe={recipe} me={me} handleShow={handleShow}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary" style={{ margin: '.5rem 0', height: 'fitContent'}}>Source <FaExternalLinkAlt /> </Button>
                    </a>
                    <Button variant="secondary" onClick={handleShow} style={{margin: '.5rem 0', height: 'fitContent'}}>
                        Open <FaLayerGroup />
                    </Button>
                </div>
            </RecipeCardBody>
        </Card >
    )
}

