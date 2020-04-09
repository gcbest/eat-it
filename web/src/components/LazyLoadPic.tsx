import React, { Fragment } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Image } from 'lib/interfaces';
import placeholderImg from '../assets/images/recipe_placeholder.jpg'

interface Props<T> {
    image: T
}

const LazyLoadPic: React.FC<Props<Image>> = ({ image }) => (
    <div>
        <LazyLoadImage
            className={image.className}
            effect="blur"
            alt={image.alt}
            height={image.height}
            src={image.src} 
            style={image.style}
            scrollPosition={image.scrollPosition}
            placeholderSrc={placeholderImg}
            width={image.width} />
        <span style={{display: 'block'}}>{image.caption}</span>
    </div>
);

export default LazyLoadPic;