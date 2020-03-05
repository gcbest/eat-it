import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'

interface Props {
    image: string
    title: string
}

export const MealItem: React.FC<Props> = ({ image, title }) => {
    const handleClick = () => { }

    return (<ListGroup.Item onClick={handleClick}> <img src={image} alt={title} /> {title}</ListGroup.Item>)
}
