import React from 'react';
import { Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const dataCarousel = [
  {
    image:
      'https://res.cloudinary.com/phongbuiduy/image/upload/v1623085103/fashionshop/carousel/monigote_gnzuhj.jpg',
    subtitle: "SUMMER '21",
    title: 'Night Summer Dresses',
    position: 'left',
  },
  {
    image:
      'https://res.cloudinary.com/phongbuiduy/image/upload/v1623085132/fashionshop/carousel/curly_hair_white-1_x4bo5v.jpg',
    subtitle: '50% OFF',
    title: 'New Cocktail Dresses',
    position: 'right',
  },
  {
    image:
      'https://res.cloudinary.com/phongbuiduy/image/upload/v1623085147/fashionshop/carousel/curly_hair_girl-1_rus3zv.jpg',
    subtitle: "SPRING/SUMMER '21",
    title: 'The Weekent Getaway',
    position: 'left',
  },
];

const HomeCarousel = () => {
  return (
    <div>
      <Carousel
        autoPlay
        interval={5000}
        infiniteLoop
        showIndicators
        showArrows
        swipeable={false}
        showThumbs={false}
        showStatus={false}
        animationHandler='fade'
      >
        {dataCarousel.map((slide, index) => (
          <div className='carousel__slide' key={index}>
            <img src={slide.image} alt='' className='carousel__img' />
            <div
              className={`carousel__banner carousel__banner--${slide.position}`}
            >
              <div className='banner__subtitle'>{slide.subtitle}</div>
              <h2 className='banner__title'>{slide.title}</h2>
              <Button
                to='/shop'
                component={RouterLink}
                size='small'
                variant='outlined'
                color='secondary'
                className='banner__link'
              >
                Shop Now
              </Button>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HomeCarousel;
