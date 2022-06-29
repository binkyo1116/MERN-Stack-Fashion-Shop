import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../actions/orderActions';
import { openSnackbar } from '../actions/snackbarActions';
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Breadcrumbs,
  Link,
  Divider,
  ListItemText,
  ListItem,
  List,
  ListItemIcon,
  Avatar,
  Box,
  Hidden,
  ListItemAvatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { GrLocation, GrCreditCard, GrProjects } from 'react-icons/gr';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';
import paypalImage from '../assets/images/paypal.png';

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
  },
  content: {
    padding: 24,
    boxShadow: '0 10px 31px 0 rgba(0,0,0,0.05)',
    [theme.breakpoints.down('sm')]: {
      padding: 32,
    },
  },
  form: {
    marginTop: 16,
    '& > *': {
      marginBottom: 16,
    },
  },
  banner: {
    width: '100%',
    height: 380,
  },
  orderItems: {
    flexWrap: 'wrap',
    paddingRight: 0,
  },
  items: {
    flexBasis: '100%',
    marginLeft: 56,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
    },
    '& .MuiTableCell-root': {
      paddingLeft: 0,
    },
    '& .MuiTableCell-head': {
      color: 'rgba(0, 0, 0, 0.54)',
      fontWeight: 400,
    },
  },
  largeImage: {
    width: theme.spacing(6),
    height: theme.spacing(8),
  },
  empty: {
    ...theme.mixins.customize.centerFlex('column wrap'),
    marginTop: 30,
  },
  cartTotalWrapper: {
    marginTop: 22,
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
  divider: {
    margin: '8px 0',
    width: 80,
    height: 2,
    backgroundColor: '#2a2a2a',
  },
  itemName: {
    ...theme.mixins.customize.textClamp(2),
  },
}));

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const cart = useSelector((state) => state.cart);

  if (!cart.shippingAddress.address) {
    history.push('/shipping');
  } else if (!cart.paymentMethod) {
    history.push('/payment');
  }
  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const address = Object.values(cart.shippingAddress).join(', ');

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.priceSale * item.qty, 0)
  );
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
      dispatch(openSnackbar('Order has been created successfully', 'success'));
    }
    // eslint-disable-next-line
  }, [history, success]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <Container maxWidth='xl' style={{ marginBottom: 48 }}>
      <Meta title='Place Order | FashionShop' />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' />}
            style={{ marginBottom: 24 }}
          >
            <Link color='inherit' component={RouterLink} to='/'>
              Home
            </Link>
            <Link color='textPrimary' component={RouterLink} to='/payment'>
              Place Order
            </Link>
          </Breadcrumbs>
          <CheckoutSteps step={3} />
        </Grid>
      </Grid>
      <Paper elevation={0} className={classes.content}>
        <Grid container spacing={8}>
          <Grid item xs={12} lg={8}>
            <List>
              <ListItem divider>
                <ListItemIcon>
                  <GrLocation fontSize={22} />
                </ListItemIcon>
                <ListItemText primary='Shipping' secondary={address} />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <GrCreditCard fontSize={22} />
                </ListItemIcon>
                <ListItemText
                  primary='Payment Method'
                  secondary={cart.paymentMethod}
                />
                <ListItemAvatar>
                  <img src={paypalImage} alt='' width='80px' height='30px' />
                </ListItemAvatar>
              </ListItem>
              <ListItem className={classes.orderItems}>
                <ListItemIcon>
                  <GrProjects fontSize={22} />
                </ListItemIcon>
                <ListItemText primary='Order Items' />
                {cart.cartItems.length > 0 ? (
                  <div className={classes.items}>
                    <TableContainer component={Paper} elevation={0}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Products</TableCell>
                            <Hidden smDown>
                              <TableCell align='right'>Size</TableCell>
                              <TableCell align='right'>Price</TableCell>
                            </Hidden>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {cart.cartItems.map((item) => (
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
                                    className={classes.itemName}
                                    style={{ marginLeft: 16 }}
                                  />
                                </ListItem>
                                <Hidden mdUp>
                                  <Box
                                    display='flex'
                                    justifyContent='space-between'
                                    alignItems='center'
                                    mt={2}
                                  >
                                    <Box textAlign='center'>
                                      Size: {item.sizeSelected.toUpperCase()}
                                    </Box>
                                    <Box textAlign='center'>
                                      {`${item.qty} x ${item.priceSale} = ${
                                        item.qty * item.priceSale
                                      }`}
                                    </Box>
                                  </Box>
                                </Hidden>
                              </TableCell>
                              <Hidden smDown>
                                <TableCell align='right'>
                                  {item.sizeSelected.toUpperCase()}
                                </TableCell>
                                <TableCell align='right'>
                                  {`${item.qty} x $${item.priceSale} = $${
                                    item.qty * item.priceSale
                                  }`}
                                </TableCell>
                              </Hidden>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
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
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Paper elevation={0} className={classes.cartTotalWrapper}>
              <Typography variant='h4' style={{ fontSize: 23 }}>
                Order Summary
              </Typography>
              <Divider className={classes.divider} />
              <List style={{ padding: '10px 20px 20px' }}>
                <ListItem divider disableGutters>
                  <ListItemText primary='Items:' />
                  <Typography>${cart.itemsPrice}</Typography>
                </ListItem>
                <ListItem divider disableGutters>
                  <ListItemText primary='Shipping:' />
                  <Typography>${cart.shippingPrice}</Typography>
                </ListItem>
                <ListItem divider disableGutters>
                  <ListItemText primary='Tax:' />
                  <Typography>${cart.taxPrice}</Typography>
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText primary='Total:' />
                  <Typography color='secondary'>${cart.totalPrice}</Typography>
                </ListItem>
              </List>
              {error && <Message mb={16}>{error}</Message>}
              <Button
                variant='contained'
                color='secondary'
                fullWidth
                disabled={cart.cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                Place Order
              </Button>
              <Button
                variant='contained'
                component={RouterLink}
                to='/payment'
                fullWidth
                style={{ marginTop: 16 }}
              >
                Back
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PlaceOrderScreen;
