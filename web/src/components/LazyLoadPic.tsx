import React, { Fragment } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Image } from 'lib/interfaces';

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
            scrollPosition={image.scrollPosition}
            width={image.width} />
        <span>{image.caption}</span>
    </div>
);

export default LazyLoadPic;