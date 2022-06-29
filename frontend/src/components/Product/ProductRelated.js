import { Box, Grid, Paper, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listRelatedProducts } from '../../actions/productActions';
import ProductCard from './ProductCard';
import Loader from '../Loader';
import Message from '../Message';

const ProductRelated = ({ category = '' }) => {
  const dispatch = useDispatch();
  const productRelated = useSelector((state) => state.productRelated);
  const { loading, error, products = [] } = productRelated;

  useEffect(() => {
    dispatch(listRelatedProducts(category));
  }, [dispatch, category]);
  return (
    <>
      <Box my={3}>
        <Typography variant='h5'>Related Products</Typography>
      </Box>
      <Paper
        style={{ padding: '32px 20px', margin: '24px 0 50px' }}
        elevation={0}
      >
        <Grid container spacing={4}>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message>{error}</Message>
          ) : (
            <>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard {...product} />
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </Paper>
    </>
  );
};

export default ProductRelated;
