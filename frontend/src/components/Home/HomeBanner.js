import { Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import bannerImage1 from '../../assets/images/banner_1.jpg';
import bannerImage2 from '../../assets/images/banner_2.jpg';
import React from 'react';

const theme = createMuiTheme({
  breakpoints: {
    values: { xs: 0, sm: 760, md: 960, lg: 1200, xl: 1400 },
  },
});

const HomeBanner = () => {
  return (
    <div className='banner'>
      <ThemeProvider theme={theme}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <div className='banner__inner banner__inner--left'>
              <img
                src={bannerImage1}
                alt='banner img'
                className='banner__image'
              ></img>
              <div className='banner__content'>
                <div className='content__wrapper'>
                  <div className='content__subtitle'>Fashion Shop</div>
                  <h2 className='content__title'>
                    Men &amp;
                    <br /> Women Clothes
                  </h2>
                  <div className='content__sale'>UP TO 70% OFF</div>
                  <Button
                    variant='outlined'
                    color='secondary'
                    className='content__button'
                    component={Link}
                    to='/shop'
                  >
                    SHOP NOW
                  </Button>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className='banner__inner banner__inner--right'>
              <img
                src={bannerImage2}
                alt='banner img'
                className='banner__image'
              ></img>
              <div className='banner__content'>
                <div className='content__wrapper'>
                  <span className='content__subtitle'>Fashion Shop</span>
                  <h2 className='content__title'>
                    Famous &amp;
                    <br /> Local Brands
                  </h2>
                  <span className='content__sale'>UP TO 55% OFF</span>
                  <Button
                    variant='outlined'
                    color='secondary'
                    className='content__button'
                    component={Link}
                    to='/shop'
                  >
                    SHOP NOW
                  </Button>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
};

export default HomeBanner;
