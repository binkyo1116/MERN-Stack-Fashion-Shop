import {
  Avatar,
  Box,
  Divider,
  Grid,
  Paper,
  Typography,
  TextField,
  Link,
  Button,
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { PRODUCT_CREATE_REVIEW_RESET } from '../../constants/productConstants.js';
import { createProductReview } from '../../actions/productActions.js';
import Message from '../Message';
import Loader from '../Loader';

const useStyles = makeStyles((theme) => ({
  form: {
    ...theme.mixins.customize.flexMixin('center', 'flex-start', 'column'),
    '& > *': {
      marginBottom: 16,
    },
  },
}));

const ProductReview = ({ reviews, productId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate;

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    if (comment.trim()) {
      setMessage('');
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      dispatch(
        createProductReview(productId, {
          rating,
          comment,
        })
      );
    } else {
      setMessage('Please write a comment!');
    }
  };

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment('');
    }
    if (!productId) {
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
  }, [dispatch, successProductReview, productId]);

  return (
    <>
      <Box my={3}>
        <Typography variant='h5'>Reviews</Typography>
      </Box>
      <Paper style={{ padding: 20, margin: '24px 0' }} elevation={0}>
        {reviews.map((review) => (
          <>
            <Grid container wrap='nowrap' spacing={2}>
              <Grid item>
                <Avatar
                  alt='avatar'
                  src={`https://ui-avatars.com/api/?background=random&color=fff&name=${review.name}`}
                />
              </Grid>
              <Grid item xs zeroMinWidth>
                <Box display='flex' alignItems='center'>
                  <h4
                    style={{
                      margin: '0 8px 0 0',
                      textAlign: 'left',
                      display: 'inline-block',
                    }}
                  >
                    {review.name}
                  </h4>
                  <p style={{ margin: 0, textAlign: 'left', color: 'gray' }}>
                    {review.createdAt.substring(0, 10)}
                  </p>
                </Box>
                <Rating
                  name='rating'
                  value={review.rating}
                  precision={0.5}
                  readOnly
                  size='small'
                />
                <p style={{ textAlign: 'left', marginTop: 5 }}>
                  {review.comment}
                </p>
              </Grid>
            </Grid>
            <Divider variant='fullWidth' style={{ margin: '30px 0' }} />
          </>
        ))}
        <Grid container>
          <Grid item xs={12}>
            {loadingProductReview && <Loader />}
            {errorProductReview && <Message>{errorProductReview}</Message>}
            {userInfo ? (
              <form onSubmit={handleSubmitReview} className={classes.form}>
                <Typography variant='h5'>Write a review</Typography>
                <Rating
                  name='rating-value'
                  value={rating}
                  precision={0.5}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />
                <TextField
                  variant='outlined'
                  label='Comment'
                  multiline
                  fullWidth
                  value={comment}
                  error={!!message}
                  helperText={message}
                  onChange={handleCommentChange}
                ></TextField>
                <Button variant='contained' color='secondary' type='submit'>
                  Submit
                </Button>
              </form>
            ) : (
              <Message severity='info'>
                Please{' '}
                <Link
                  component={RouterLink}
                  to={`/login?redirect=/product/${productId}`}
                >
                  login
                </Link>{' '}
                to write a review
              </Message>
            )}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default ProductReview;
