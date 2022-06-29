import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts, deleteProduct } from '../actions/productActions';
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Breadcrumbs,
  Link,
  Box,
} from '@material-ui/core';
import { openSnackbar } from '../actions/snackbarActions';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from '@material-ui/data-grid';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
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
  dataGrid: {
    boxShadow: '0 10px 31px 0 rgba(0,0,0,0.05)',
  },
}));

const ProductListScreen = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  let { loading, error, products = [] } = productList;
  products = products.map((product) => ({ ...product, id: product._id }));

  const productDelete = useSelector((state) => state.productDelete);
  const { error: errorDelete, success: successDelete } = productDelete;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const columns = [
    { field: '_id', headerName: 'ID', width: 220 },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 160,
    },
    {
      field: 'brand',
      headerName: 'Brand',
      width: 120,
    },
    {
      field: 'sale',
      headerName: 'Sale',
      width: 120,
      valueFormatter: (params) => `${params.value} %`,
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
              to={`/admin/product/${id}/edit`}
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
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login');
    }

    dispatch(listProducts('', '', 'all'));
  }, [dispatch, history, userInfo, successDelete]);

  useEffect(() => {
    if (successDelete) {
      dispatch(openSnackbar('The product has been deleted', 'success'));
    } else if (errorDelete) {
      dispatch(openSnackbar(errorDelete, 'error'));
    }
  }, [dispatch, successDelete, errorDelete]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <Container maxWidth='xl' style={{ marginBottom: 48 }}>
      <Meta title='Dashboard | Products' />
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
              Products
            </Link>
          </Breadcrumbs>
          <div>
            <Typography
              variant='h5'
              component='h1'
              style={{ textAlign: 'center' }}
            >
              Product Management
            </Typography>
            <Box display='flex' justifyContent='flex-end' mb={2}>
              <Button
                variant='contained'
                color='secondary'
                startIcon={<AiOutlinePlus />}
                component={RouterLink}
                to='/admin/product/create'
              >
                Create Product
              </Button>
            </Box>
          </div>
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
            className={classes.dataGrid}
            elevation={0}
          >
            <DataGrid
              rows={products}
              columns={columns}
              pageSize={10}
              autoHeight
              components={{
                Toolbar: () => (
                  <GridToolbarContainer>
                    <GridToolbarExport />
                  </GridToolbarContainer>
                ),
              }}
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default ProductListScreen;
