import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listTopProducts } from '../actions/productActions';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import HomeCarousel from '../components/Home/HomeCarousel';
import Container from '@material-ui/core/Container';
import HomeBanner from '../components/Home/HomeBanner';
import ProductCard from '../components/Product/ProductCard';
import { Grid, Typography, Button } from '@material-ui/core';
import ProductTabs from '../components/Product/ProductTabs';
import HomeService from '../components/Home/HomeService';
import Alert from '@material-ui/lab/Alert';

const HomeScreen = ({ location }) => {
  const dispatch = useDispatch();
  const productTopRated = useSelector((state) => state.productTopRated);

  const {
    loading: loadingProductTop,
    errorProductTop,
    products: productTop,
  } = productTopRated;

  useEffect(() => {
    dispatch(listTopProducts(1, 8));
  }, [dispatch]);

  return (
    <>
      <Meta />
      <HomeCarousel />
      <Container maxWidth='xl'>
        <Typography
          variant='h4'
          component='h2'
          align='center'
          style={{ margin: '60px 0 30px' }}
        >
          Top Products
        </Typography>
        {loadingProductTop ? (
          <Loader />
        ) : errorProductTop ? (
          <Alert severity='error'>{errorProductTop}</Alert>
        ) : (
          <>
            <Grid container spacing={3}>
              {productTop.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard {...product} />
                </Grid>
              ))}
              <Grid
                item
                xs={12}
                style={{
                  display: 'flex',
                  flexBasis: '100%',
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant='contained'
                  color='secondary'
                  component={RouterLink}
                  to='/shop?sort_by=rating'
                >
                  Discover More
                </Button>
              </Grid>
            </Grid>
            <HomeBanner />
            <ProductTabs />
          </>
        )}
      </Container>
      <HomeService />
    </>
  );
};

export default HomeScreen;
