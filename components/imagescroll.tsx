'use client';

import React, {useState, useEffect} from 'react';
import styles from './ImageScroller.module.css';


interface ImageScrollerProps {
    direction: 'up' | 'down';
    images: string[];
  }
  
  const ImageScroller: React.FC<ImageScrollerProps> = ({ direction, images }) => {
    const scrollClass = direction === 'up' ? styles.scrollUp : styles.scrollDown;

    return (
      <div className={`${styles.scrollContainer} ${scrollClass} top-0 h-full w-[800px] overflow-hidden`}>
        <div className={styles.scrollContent}>
          {images.map((image, index) => (
            <img key={index} src={image} alt={`Scrolling image ${index}`} />
          ))}
          {/* Clone images to create an infinite loop effect */}
          {images.map((image, index) => (
            <img key={index + images.length} src={image} alt={`Scrolling image ${index}`} />
          ))}
        </div>
      </div>
    );
  };
  

  export default ImageScroller;