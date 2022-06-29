import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  FormControl,
  Breadcrumbs,
  Link,
  Box,
  Badge,
  Avatar,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import { openSnackbar } from '../actions/snackbarActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useForm, FormProvider } from 'react-hook-form';
import { VscEyeClosed, VscEye } from 'react-icons/vsc';
import { FaTimes } from 'react-icons/fa';
// import userPlaceholder from '../assets/images/userPlaceholder.png';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import InputController from '../components/InputController';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const StyledBadge = withStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
    '& .MuiBreadcrumbs-ol': {
      justifyContent: 'flex-start',
    },
  },
  content: {
    padding: 24,
    boxShadow: '0 10px 31px 0 rgba(0,0,0,0.05)',
  },
  paper: {
    // minHeight: 527,
    padding: 20,
    borderRadius: 10,
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
  },
  largeAvatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  profile: {
    position: 'relative',
    ...theme.mixins.customize.flexMixin('center', 'center', 'column'),
    backgroundColor: '#F8F9FD',
    padding: 20,
    marginTop: theme.spacing(4),
    borderRadius: 10,
  },
  form: {
    padding: theme.spacing(2),
    '& .MuiInput-underline:before': {
      borderColor: 'rgba(224, 224, 224, 1)',
    },
    '& .MuiInput-input': {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 13,
    },
  },
}));

const ProfileScreen = ({ history }) => {
  const classes = useStyles();
  const methods = useForm();
  const { handleSubmit, getValues, setValue } = methods;
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails('profile'));
        dispatch(listMyOrders());
      } else {
        setValue('name', user.name);
        setValue('email', user.email);
      }
    }
  }, [dispatch, setValue, history, userInfo, user, success]);

  useEffect(() => {
    if (success) {
      dispatch(
        openSnackbar('Profile has been updated successfully', 'success')
      );
    }
  }, [dispatch, success]);

  const submitHandler = ({ name, email, password }) => {
    dispatch(updateUserProfile({ id: user._id, name, email, password }));
  };

  return (
    <Container maxWidth='xl' style={{ marginBottom: 48 }}>
      <Meta title='Profile' />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' />}
            style={{ marginBottom: 24 }}
          >
            <Link color='inherit' component={RouterLink} to='/'>
              Home
            </Link>
            <Link color='textPrimary' component={RouterLink} to='/profile'>
              Profile
            </Link>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={3}>
          <Paper className={classes.paper} elevation={0}>
            {loading ? (
              <Loader />
            ) : error ? (
              <Message>{error}</Message>
            ) : (
              <>
                <Box className={classes.profile}>
                  <StyledBadge
                    overlap='circle'
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    variant='dot'
                  >
                    <Avatar
                      src={`https://ui-avatars.com/api/?background=random&color=fff&name=${user.name}`}
                      className={classes.largeAvatar}
                    />
                  </StyledBadge>
                  <Typography style={{ marginTop: 32 }}>{user.name}</Typography>
                  <Typography
                    variant='caption'
                    style={{ color: 'rgba(0, 0, 0, 0.54)' }}
                  >
                    {user.email}
                  </Typography>
                </Box>
                <FormProvider {...methods}>
                  <form
                    className={classes.form}
                    onSubmit={handleSubmit(submitHandler)}
                  >
                    <FormControl fullWidth style={{ marginBottom: 12 }}>
                      <InputController
                        name='name'
                        label='Name'
                        defaultValue={user.name}
                        required
                      />
                    </FormControl>
                    <FormControl fullWidth style={{ marginBottom: 12 }}>
                      <InputController
                        name='email'
                        label='Email'
                        defaultValue={user.email}
                        required
                        rules={{
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        }}
                      />
                    </FormControl>
                    <FormControl fullWidth style={{ marginBottom: 12 }}>
                      <InputController
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        label='Password'
                        rules={{
                          minLength: {
                            value: 6,
                            message: 'Password must be more than 6 characters',
                          },
                        }}
                      />
                    </FormControl>
                    <FormControl fullWidth style={{ marginBottom: 12 }}>
                      <InputController
                        type={showPassword ? 'text' : 'password'}
                        name='confirmPassword'
                        label='Confirm Password'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={(e) => e.preventDefault()}
                              >
                                {showPassword ? <VscEye /> : <VscEyeClosed />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        rules={{
                          validate: {
                            matchPassword: (value) =>
                              value !== getValues('password')
                                ? 'Password do not match'
                                : true,
                          },
                        }}
                      />
                    </FormControl>
                    <Button
                      type='submit'
                      variant='contained'
                      color='secondary'
                      fullWidth
                      style={{ marginTop: 16 }}
                    >
                      Update Profile
                    </Button>
                  </form>
                </FormProvider>
              </>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} lg={9}>
          <TableContainer
            component={Paper}
            className={classes.paper}
            elevation={0}
          >
            <Typography variant='h5'>My Orders</Typography>
            {loadingOrders ? (
              <Loader />
            ) : errorOrders ? (
              <Message>{errorOrders}</Message>
            ) : !orders.length ? (
              <Message mt={8} severity='info'>
                No order has been made yet.{' '}
                <Link component={RouterLink} to='/'>
                  Shop now!
                </Link>
              </Message>
            ) : (
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align='right'>Date</TableCell>
                    <TableCell align='right'>Total&nbsp;($)</TableCell>
                    <TableCell align='right'>Paid</TableCell>
                    <TableCell align='right'>Deliverd</TableCell>
                    <TableCell align='right'>Detail</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell component='th' scope='order'>
                        {order._id}
                      </TableCell>
                      <TableCell align='right'>
                        {order.createdAt.substring(0, 10)}
                      </TableCell>
                      <TableCell align='right'>{order.totalPrice}</TableCell>
                      <TableCell align='right'>
                        {order.paidAt ? (
                          order.paidAt.substring(0, 10)
                        ) : (
                          <FaTimes color='red' />
                        )}
                      </TableCell>
                      <TableCell align='right'>
                        {order.deliveredAt ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <FaTimes color='red' />
                        )}
                      </TableCell>
                      <TableCell align='right'>
                        <Button
                          variant='contained'
                          size='small'
                          component={RouterLink}
                          to={`/order/${order._id}`}
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileScreen;
