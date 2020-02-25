import React from 'react'
import { DiscoveryResults } from 'components/DiscoveryResults'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'

// export const QueryContext = React.createContext();

export const Discover: React.FC = () => {
    return (
        <div>
            <QueryContext.Provider value={''}>
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Recipient's username"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                    />
                    <InputGroup.Append>
                        <Button variant="outline-secondary">Search</Button>
                    </InputGroup.Append>
                </InputGroup>
                <DiscoveryResults />
            </QueryContext.Provider>
        </div>
    )
}

