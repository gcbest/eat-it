import React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

interface Props {
    children: any,
    defaultActiveKey: string
}

const CollapsibleCard: React.FC<Props> = ({defaultActiveKey, children}) => {
    return (
        <Accordion defaultActiveKey={defaultActiveKey} style={{ marginTop: '4rem' }}>
            <Card style={{ border: '1px solid rgba(0, 0, 0, 0.125)', borderRadius: '0.4rem' }}>
                {children}
            </Card>
        </Accordion>
    )
}

export default CollapsibleCard
