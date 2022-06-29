import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { PayPalButton } from 'react-paypal-button-v2';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById, payOrder, deliverOrder } from '../actions/orderActions';
import { Link as RouterLink } from 'react-router-dom';
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from '../constants/orderConstants';
import {
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
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { GrLocation, GrCreditCard, GrProjects, GrUser } from 'react-icons/gr';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Meta from '../components/Meta';
import paypalImage from '../assets/images/paypal.png';

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
  },
  content: {
    padding: 24,
    boxShadow: '0 10px 31px 0 rgba(0,0,0,0.05)',
    [theme.breakpoints.down('sm')]: {
      padding: 32,
    },
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

const OrderScreen = ({ match, history }) => {
  const classes = useStyles();
  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading && order) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = addDecimals(
      order?.orderItems.reduce(
        (acc, item) => acc + item.priceSale * item.qty,
        0
      )
    );
  }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderById(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, history, orderId, successPay, successDeliver, order, userInfo]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader my={200} />
  ) : error ? (
    <Message mt={100}>{error}</Message>
  ) : (
    <Container maxWidth='xl' style={{ marginBottom: 48 }}>
      <Meta title='Order | FashionShop' />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' />}
            style={{ marginBottom: 24 }}
          >
            <Link color='inherit' component={RouterLink} to='/'>
              Home
            </Link>
            <Link color='textPrimary' component={RouterLink} to='/order'>
              Order Details
            </Link>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Paper elevation={0} className={classes.content}>
        <Grid container spacing={8}>
          <Grid item xs={12} lg={8}>
            <List>
              <ListItem divider>
                <ListItemText
                  primary={`Order`}
                  secondary={`id: ${order._id}`}
                />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <GrUser fontSize={22} />
                </ListItemIcon>
                <ListItemText
                  primary='Receiver'
                  secondary={`${order.user.name}, email: ${order.user.email}`}
                />
              </ListItem>
              <ListItem divider style={{ flexWrap: 'wrap' }}>
                <ListItemIcon>
                  <GrLocation fontSize={22} />
                </ListItemIcon>
                <ListItemText
                  primary='Shipping'
                  secondary={Object.values(order.shippingAddress).join(', ')}
                />
                {order.isDelivered ? (
                  <Message severity='success' mt={8}>
                    Delivered on {new Date(order.deliveredAt).toUTCString()}
                  </Message>
                ) : (
                  <Message mt={8}>Not Delivered</Message>
                )}
              </ListItem>
              <ListItem divider style={{ flexWrap: 'wrap' }}>
                <ListItemIcon>
                  <GrCreditCard fontSize={22} />
                </ListItemIcon>
                <ListItemText
                  primary='Payment Method'
                  secondary={order.paymentMethod}
                />
                <ListItemAvatar>
                  <img src={paypalImage} alt='' width='80px' height='30px' />
                </ListItemAvatar>
                {order.isPaid ? (
                  <Message severity='success' mt={8}>
                    Paid on {new Date(order.paidAt).toUTCString()}
                  </Message>
                ) : (
                  <Message mt={8}>Not Paid</Message>
                )}
              </ListItem>
              <ListItem className={classes.orderItems}>
                <ListItemIcon>
                  <GrProjects fontSize={22} />
                </ListItemIcon>
                <ListItemText primary='Order Items' />
                {order.orderItems.length > 0 ? (
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
                          {order.orderItems.map((item) => (
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
                  <Typography>${order.itemsPrice}</Typography>
                </ListItem>
                <ListItem divider disableGutters>
                  <ListItemText primary='Shipping:' />
                  <Typography>${order.shippingPrice}</Typography>
                </ListItem>
                <ListItem divider disableGutters>
                  <ListItemText primary='Tax:' />
                  <Typography>${order.taxPrice}</Typography>
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText primary='Total:' />
                  <Typography color='secondary'>${order.totalPrice}</Typography>
                </ListItem>
              </List>
              {!order.isPaid && (
                <Box fullWidth>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                      style={{ width: '100%' }}
                    />
                  )}
                </Box>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <Box>
                    <Button
                      variant='contained'
                      color='secondary'
                      fullWidth
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </Box>
                )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default OrderScreen;
