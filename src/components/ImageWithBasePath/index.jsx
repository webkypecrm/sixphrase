
import React from 'react';
// import { img_path } from '../../../environment';



const ImageWithBasePath = (props) => {
    // Combine the base path and the provided src to create the full image source URL
    const fullSrc = `/${props.src}`;
    return (
        <img
            className={props.className}
            src={fullSrc}
            height={props.height}
            alt={props.alt}
            width={props.width}
            id={props.id}
        />
    );
};

export default ImageWithBasePath;
