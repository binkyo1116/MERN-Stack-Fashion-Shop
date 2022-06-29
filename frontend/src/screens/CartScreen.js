import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Meta from '../components/Meta';
import { removeFromCart } from '../actions/cartActions';
import { openSnackbar } from '../actions/snackbarActions';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Grid,
  Hidden,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ProductFormSelect from '../components/Product/ProductFormSelect';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
  },
  largeImage: {
    width: theme.spacing(12),
    height: theme.spacing(15),
  },
  cartTotalWrapper: {
    padding: 20,
    fontSize: 16,
    backgroundColor: '#F4F4F4',
  },
  cartTotal: {
    fontSize: 18,
    marginBottom: 8,
    '&:nth-child(2)': {
      color: theme.palette.secondary.main,
    },
  },
  formControl: {
    marginRight: 24,
  },
  divider: {
    margin: '8px 0',
    width: 60,
    height: 2,
    backgroundColor: '#2a2a2a',
  },
}));

const CartScreen = ({ history }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.qty * item.priceSale, 0)
    .toFixed(2);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
    dispatch(openSnackbar('Item has been removed from the cart', 'success'));
  };

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping');
  };

  return (
    <Container maxWidth='xl' style={{ marginBottom: 48 }}>
      <Meta title='Shopping Cart | FashionShop' />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item>
          <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />}>
            <Link color='inherit' component={RouterLink} to='/'>
              Home
            </Link>
            <Link color='textPrimary' component={RouterLink} to='/cart'>
              Shopping Cart
            </Link>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          {cartItems.length > 0 ? (
            <>
              <TableContainer component={Paper} elevation={0}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Products</TableCell>
                      <Hidden smDown>
                        <TableCell align='right'>Price</TableCell>
                        <TableCell align='right'>Size &amp; Quantity</TableCell>
                        <TableCell align='right'>Action</TableCell>
                      </Hidden>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell component='th' scope='item'>
                          <ListItem disableGutters>
                            <ListItemAvatar>
                              <Avatar
                                variant='square'
                                src={item.images && item.images[0]}
                                alt='product image'
                                className={classes.largeImage}
                              ></Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={item.name}
                              style={{ marginLeft: 16 }}
                            />
                          </ListItem>
                          <Hidden mdUp>
                            <Divider variant='fullWidth' />
                            <Box
                              display='flex'
                              justifyContent='space-between'
                              alignItems='center'
                              mt={2}
                            >
                              <Box textAlign='center'>${item.priceSale}</Box>
                              <Box textAlign='center'>
                                <ProductFormSelect item={item} />
                              </Box>
                              <Box textAlign='center'>
                                <IconButton
                                  edge='end'
                                  onClick={() =>
                                    removeFromCartHandler(item.product)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Box>
                          </Hidden>
                        </TableCell>
                        <Hidden smDown>
                          <TableCell align='right'>${item.priceSale}</TableCell>
                          <TableCell align='right'>
                            <ProductFormSelect item={item} />
                          </TableCell>
                          <TableCell align='right'>
                            <IconButton
                              edge='end'
                              onClick={() =>
                                removeFromCartHandler(item.product)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </Hidden>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <div className={classes.empty}>
              <Typography variant='subtitle1' color='secondary'>
                Your cart is empty.{' '}
                <Link to='/' component={RouterLink} color='primary'>
                  Shopping now!
                </Link>
              </Typography>
            </div>
          )}
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} className={classes.cartTotalWrapper}>
            <Typography variant='h4' style={{ fontSize: 23 }}>
              Cart Total
            </Typography>
            <Divider className={classes.divider} />
            <List style={{ padding: '10px 0 20px' }}>
              <ListItem divider disableGutters>
                <ListItemText primary='Items:' />
                <Typography>
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </Typography>
              </ListItem>
              <ListItem divider disableGutters>
                <ListItemText primary='Total Price:' />
                <Typography color='secondary'>${totalPrice}</Typography>
              </ListItem>
            </List>
            <Button
              variant='contained'
              color='secondary'
              fullWidth
              style={{ marginTop: 8 }}
              onClick={checkoutHandler}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartScreen;
