import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/userActions';
import { Link as RouterLink } from 'react-router-dom';
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { useForm, FormProvider } from 'react-hook-form';
import { ReactComponent as LoginImage } from '../assets/images/login-illu.svg';
import { USER_REGISTER_RESET } from '../constants/userConstants';
import logo from '../assets/images/logo.png';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import InputController from '../components/InputController';
import backgroundImage from '../assets/images/background.jpg';
import { VscEyeClosed, VscEye } from 'react-icons/vsc';
import { BiArrowBack } from 'react-icons/bi';

const theme = createMuiTheme({
  typography: {
    fontFamily: ['Poppins', 'sans-serif'].join(','),
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.mixins.customize.centerFlex(),
    height: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    fontFamily: 'Poppins, sans-serif',
  },
  container: {
    height: '85vh',
    width: '70%',
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
    boxShadow: '0px 0px 25px -18px rgba(0,0,0,0.75)',
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  image: {
    objectFit: 'cover',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgb(227, 65, 85, 0.08)',
  },
  content: {
    position: 'relative',
    ...theme.mixins.customize.flexMixin('flex-start', 'center', 'column'),
    padding: '24px 20%',
    height: '100%',
    [theme.breakpoints.down('xs')]: {
      padding: '24px 10%',
    },
  },
  form: {
    paddingTop: theme.spacing(1),
  },
  backIcon: {
    position: 'absolute',
    top: 5,
    left: 0,
  },
  logo: {
    width: '120px',
    marginTop: 8,
  },
}));

const RegisterScreen = ({ location, history }) => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm();
  const { handleSubmit, getValues } = methods;

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const { redirect = '/login' } = queryString.parse(location.search);

  useEffect(() => {
    if (userInfo) {
      history.push(`/login?redirect=${redirect}`);
      dispatch({ type: USER_REGISTER_RESET });
    }
  }, [dispatch, history, userInfo, redirect]);

  const submitHandler = ({ name, email, password }) => {
    dispatch(register(name, email, password));
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper className={classes.root} square>
        <Grid container component={Paper} className={classes.container}>
          <Grid item sm={12} md={6}>
            <Box className={classes.content}>
              <Button
                component={RouterLink}
                to='/'
                startIcon={<BiArrowBack />}
                className={classes.backIcon}
              />
              <img src={logo} alt='' className={classes.logo} />
              <FormProvider {...methods}>
                <form
                  className={classes.form}
                  onSubmit={handleSubmit(submitHandler)}
                >
                  <FormControl fullWidth style={{ marginBottom: 16 }}>
                    <InputController name='name' label='Name' required />
                  </FormControl>
                  <FormControl fullWidth style={{ marginBottom: 16 }}>
                    <InputController
                      name='email'
                      label='Email'
                      required
                      rules={{
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      }}
                    />
                  </FormControl>
                  <FormControl fullWidth style={{ marginBottom: 8 }}>
                    <InputController
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                      label='Password'
                      required
                      rules={{
                        minLength: {
                          value: 6,
                          message: 'Password must be more than 6 characters',
                        },
                      }}
                    />
                  </FormControl>
                  <FormControl fullWidth style={{ marginBottom: 8 }}>
                    <InputController
                      type={showPassword ? 'text' : 'password'}
                      name='confirmPassword'
                      label='Confirm Password'
                      required
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
                    Sign up
                  </Button>
                </form>
              </FormProvider>
              <Box my={2}>
                Have an account?{' '}
                <Link component={RouterLink} to={`/login?redirect=${redirect}`}>
                  Login
                </Link>
              </Box>
              {loading && <Loader my={0} />}
              {error && <Message mt={0}>{error}</Message>}
            </Box>
          </Grid>
          <Hidden smDown>
            <Grid item xs={6}>
              <LoginImage className={classes.image} />
            </Grid>
          </Hidden>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
};

export default RegisterScreen;
