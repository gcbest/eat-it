import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import { ModalCategory } from 'lib/enums'
import { RecipeTag } from './RecipeTag'
import ReactTags, {Tag as ReactTag} from 'react-tag-autocomplete'
import nanoid from 'nanoid'
import { User, ModalInterface } from 'lib/interfaces'
import { Tag } from 'generated/graphql'

interface Props {
    params: ModalInterface
    me?: User
    setUpdatedTags?: (tags: Tag[]) => void
}

const RecipeTagsArea: React.FC<Props> = ({ params, me, setUpdatedTags }) => {
    const { recipe, modalType } = params
    const [tags, setTags] = useState<Tag[]>([])


    // REACT TAGS
    /////////////////////////////////// 
    const [suggestions, setSuggestions] = useState<Tag[]>([])

    const handleDelete = (indexToRmv: number) => {
        if (modalType === ModalCategory.View)
            return // not allowed to edit tags in view mode

        const updatedTags = tags.filter((_: any, index: number) => !(index === indexToRmv))
        setTags(updatedTags)
        if(setUpdatedTags)
            setUpdatedTags(updatedTags)
    }

    const handleAddition = (tag: ReactTag) => {
        if (modalType === ModalCategory.View)
            return // not allowed to edit tags in view mode

        const newTag: Tag = { ...tag, id: nanoid(8) }
        const updatedTags = [...tags, newTag]
        setTags(updatedTags)
        if(setUpdatedTags)
            setUpdatedTags(updatedTags)
    }

    const recipeTags = recipe && recipe.tags
    const userTags = me && me.tags

    useEffect(() => {
        if (userTags)
            setSuggestions(userTags)
        if (recipeTags) {
            setTags(recipeTags)
        }
    }, [userTags, recipeTags])
    /////////////////////////////////// 

    return (
        <div style={{ width: '100%' }}>
            <Form.Label>Recipe Tags</Form.Label>
            <br />
            {modalType === ModalCategory.View ? // replace editable tags with display badges
                tags && tags.map(t => <RecipeTag key={t.id} text={t.name} />)
                :
                <ReactTags
                    tags={tags}
                    suggestions={suggestions}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    allowNew={true}
                    allowBackspace={false}
                />
            }
        </div>
    )
}

export default RecipeTagsArea
