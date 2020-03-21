import React, { Fragment } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Image } from 'lib/interfaces';

interface Props<T> {
    image: T
}

const LazyLoadPic: React.FC<Props<Image>> = ({ image }) => (
    <div>
        <LazyLoadImage
            effect="black-and-white"
            alt={image.alt}
            height={image.height}
            src={image.src} 
            width={image.width} />
        <span>{image.caption}</span>
    </div>
);

export default LazyLoadPic;