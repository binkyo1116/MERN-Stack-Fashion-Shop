import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  InputBase,
  InputLabel,
  FormControl,
  FormHelperText,
  Breadcrumbs,
  Link,
} from '@material-ui/core';
import { ReactComponent as Banner } from '../assets/images/shipping.svg';
import { Link as RouterLink } from 'react-router-dom';
import { saveShippingAddress } from '../actions/cartActions';
import { makeStyles, withStyles, fade } from '@material-ui/core/styles';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';

const Input = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '&.Mui-error $input': {
      borderColor: '#f44336',
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
  },
  form: {
    '& > *': {
      marginBottom: 16,
    },
  },
  content: {
    padding: 24,
    boxShadow: '0 10px 31px 0 rgba(0,0,0,0.05)',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
}));

const ShippingScreen = ({ history }) => {
  const classes = useStyles();
  const methods = useForm();
  const { handleSubmit, control } = methods;
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.userLogin);
  const { shippingAddress } = cart;

  const dispatch = useDispatch();

  const onSubmit = ({ address, city, postalCode, country }) => {
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    history.push('/payment');
  };

  useEffect(() => {
    if (!userInfo) {
      history.push(`/login?redirect=shipping`);
    }
  }, [userInfo, history]);

  return (
    <Container maxWidth='xl' style={{ marginBottom: 48 }}>
      <Meta title='Shipping | FashionShop' />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' />}
            style={{ marginBottom: 24 }}
          >
            <Link color='inherit' component={RouterLink} to='/'>
              Home
            </Link>
            <Link color='textPrimary' component={RouterLink} to='/shipping'>
              Shipping
            </Link>
          </Breadcrumbs>
          <CheckoutSteps step={1} />
        </Grid>
      </Grid>
      <Paper elevation={0} className={classes.content}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>
            <Typography variant='h5' gutterBottom>
              Shipping Address:
            </Typography>
            <FormProvider {...methods}>
              <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name='address'
                  defaultValue={shippingAddress.address || ''}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <InputLabel shrink htmlFor='shipping-address'>
                        Address
                      </InputLabel>
                      <Input {...field} id='shipping-address' fullWidth />{' '}
                      {error && (
                        <FormHelperText error>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                  rules={{ required: '(*) Address is required' }}
                />
                <Controller
                  name='city'
                  defaultValue={shippingAddress.city || ''}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <InputLabel shrink htmlFor='shipping-city'>
                        City
                      </InputLabel>
                      <Input {...field} id='shipping-city' fullWidth />{' '}
                      {error && (
                        <FormHelperText error>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                  rules={{ required: '(*) City is required' }}
                />
                <Controller
                  name='postalCode'
                  defaultValue={shippingAddress.postalCode || ''}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <InputLabel shrink htmlFor='shipping-postalCode'>
                        Postal Code
                      </InputLabel>
                      <Input {...field} id='shipping-postalCode' fullWidth />{' '}
                      {error && (
                        <FormHelperText error>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                  rules={{ required: '(*) Postal code is required' }}
                />
                <Controller
                  name='country'
                  defaultValue={shippingAddress.country || ''}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <InputLabel shrink htmlFor='shipping-country'>
                        Country
                      </InputLabel>
                      <Input {...field} id='shipping-country' fullWidth />{' '}
                      {error && (
                        <FormHelperText error>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                  rules={{ required: '(*) Country is required' }}
                />
                <Button type='submit' variant='contained' color='secondary'>
                  Next Step
                </Button>
              </form>
            </FormProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <Banner className={classes.banner} />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ShippingScreen;
