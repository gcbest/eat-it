import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const StyledLink = styled(Link)`
    text-decoration: none;
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
    :hover {
        width: 200%;
    }
`;

export default (props: any) => <StyledLink {...props} />;