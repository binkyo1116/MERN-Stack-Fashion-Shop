import React, { useEffect } from 'react';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUser } from '../actions/userActions';
import { openSnackbar } from '../actions/snackbarActions';
import { USER_UPDATE_RESET } from '../constants/userConstants';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';
import {
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  TextField,
  Container,
  FormControl,
  Button,
  Link,
  Box,
  Grid,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  form: {
    paddingTop: theme.spacing(1),
  },
  container: {
    marginBottom: 48,
    marginTop: 120,
  },
  paper: {
    padding: 30,
  },
}));

const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id;

  const classes = useStyles();
  const methods = useForm();
  const { handleSubmit, control, setValue } = methods;

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      history.push('/admin/userlist');
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setValue('name', user.name, { shouldValidate: true });
        setValue('email', user.email, { shouldValidate: true });
        setValue('isAdmin', user.isAdmin);
      }
    }
  }, [dispatch, history, setValue, userId, user, successUpdate]);

  useEffect(() => {
    if (successUpdate) {
      dispatch(openSnackbar('Update successful', 'success'));
    } else if (errorUpdate) {
      dispatch(openSnackbar(errorUpdate, 'error'));
    }
  }, [dispatch, successUpdate, errorUpdate]);

  const submitHandler = ({ name, email, isAdmin }) => {
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };

  return (
    <Container maxWidth='xl' className={classes.container}>
      <Grid container justify='center'>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message>{error}</Message>
        ) : (
          <Grid item xs={12} sm={6} component={Paper} className={classes.paper}>
            <div>
              <Typography
                variant='h5'
                component='h1'
                style={{ textAlign: 'center' }}
              >
                Edit User
              </Typography>
              <Box display='flex' justifyContent='flex-start' mb={2}>
                <Link component={RouterLink} to='/admin/userlist'>
                  Back
                </Link>
              </Box>
            </div>
            <form
              className={classes.form}
              onSubmit={handleSubmit(submitHandler)}
            >
              <Controller
                name='name'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth style={{ marginBottom: 16 }}>
                    <TextField
                      label='Name'
                      defaultValue=' '
                      {...field}
                      error={!!error}
                      helperText={error && error.message}
                    />
                  </FormControl>
                )}
              />
              <Controller
                name='email'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth style={{ marginBottom: 16 }}>
                    <TextField
                      label='Email'
                      defaultValue=' '
                      {...field}
                      error={!!error}
                      helperText={error && error.message}
                    />
                  </FormControl>
                )}
                rules={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
              />
              <FormControl fullWidth style={{ marginBottom: 16 }}>
                <FormControlLabel
                  control={
                    <Controller
                      name='isAdmin'
                      control={control}
                      render={({ field: { value, onChange, ...field } }) => (
                        <Checkbox
                          checked={!!value}
                          onChange={onChange}
                          {...field}
                        />
                      )}
                    />
                  }
                  label='Is Admin'
                />
              </FormControl>
              <Button type='submit' variant='contained' color='secondary'>
                Update
              </Button>
              {loadingUpdate && <Loader />}
            </form>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default UserEditScreen;
