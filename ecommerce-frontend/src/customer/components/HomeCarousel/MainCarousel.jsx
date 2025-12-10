import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { mainCarouselData } from './MainCarouselData';

const MainCarousel = () => {
    const items = mainCarouselData.map((item) => (
        <img
            key={item.id || item.image}
            className="cursor-pointer -z-10"
            role="presentation"
            src={item.image}
            alt={item.alt || ''}
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            draggable={false}
        />
    ));
  return (
    <div>
        <AliceCarousel
        items={items}
        disableDots
        disableButtonsControls
        autoPlay
        autoPlayInterval={1000}
        infinite
    />
    </div>
  )
}

export default MainCarousel