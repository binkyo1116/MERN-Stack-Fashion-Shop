import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers, deleteUser } from '../actions/userActions';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Breadcrumbs,
  Link,
  useMediaQuery,
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { openSnackbar } from '../actions/snackbarActions';
import { makeStyles } from '@material-ui/core/styles';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import Message from '../components/Message';

const useStyles = makeStyles((theme) => ({
  button: {
    padding: '6px 0',
    minWidth: '30px',
    '& .MuiButton-startIcon': {
      margin: 0,
    },
  },
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
    '& .MuiBreadcrumbs-ol': {
      justifyContent: 'flex-start',
    },
  },
  users: {
    boxShadow: '0 10px 31px 0 rgba(0,0,0,0.05)',
  },
}));

const UserListScreen = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const onMobile = useMediaQuery('(max-width:740px)');
  const userList = useSelector((state) => state.userList);
  let { loading, error, users = [] } = userList;
  users = users.map((user) => ({ ...user, id: user._id }));

  const { userInfo } = useSelector((state) => state.userLogin);
  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete = false } = userDelete;

  const columns = [
    { field: '_id', headerName: 'ID', flex: 0.2, hide: onMobile },
    { field: 'name', headerName: 'Name', flex: 0.2, hide: onMobile },
    { field: 'email', headerName: 'Email', flex: 0.3 },
    {
      field: 'isAdmin',
      headerName: 'Admin',
      flex: 0.1,
      type: 'boolean',
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const id = params.getValue(params.id, '_id') || '';
        return (
          <>
            <Button
              variant='contained'
              color='primary'
              startIcon={<AiOutlineEdit />}
              className={classes.button}
              component={RouterLink}
              to={`/admin/user/${id}/edit`}
            />
            <Button
              variant='contained'
              color='secondary'
              style={{ marginLeft: 8 }}
              className={classes.button}
              startIcon={<AiOutlineDelete />}
              onClick={() => deleteHandler(id)}
            />
          </>
        );
      },
    },
  ];

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      history.push('/login');
    }
  }, [dispatch, history, userInfo, successDelete]);

  useEffect(() => {
    if (successDelete) {
      dispatch(openSnackbar('The user has been deleted', 'success'));
    }
  }, [dispatch, successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };
  return (
    <Container maxWidth='xl' style={{ marginBottom: 48 }}>
      <Meta title='Dashboard | Users' />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' />}
            style={{ marginBottom: 24 }}
          >
            <Link color='inherit' component={RouterLink} to='/'>
              Home
            </Link>
            <Link color='inherit' component={RouterLink} to='/'>
              Admin Dashboard
            </Link>
            <Link color='textPrimary' component={RouterLink} to='/userlist'>
              Users
            </Link>
          </Breadcrumbs>
          <Typography
            variant='h5'
            component='h1'
            gutterBottom
            style={{ textAlign: 'center' }}
          >
            User Management
          </Typography>
        </Grid>
      </Grid>
      {loading ? (
        <Loader></Loader>
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <Grid container>
          <Grid
            item
            xs={12}
            component={Paper}
            className={classes.users}
            elevation={0}
          >
            <DataGrid rows={users} columns={columns} pageSize={10} autoHeight />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default UserListScreen;
