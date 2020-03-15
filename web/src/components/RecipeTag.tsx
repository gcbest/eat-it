import React from 'react'
import Badge from 'react-bootstrap/Badge'


interface Props {
    text: string
}

export const RecipeTag: React.FC<Props> = ({text}) => {
    return (
        <Badge variant="primary">{text}</Badge>
    )
}
