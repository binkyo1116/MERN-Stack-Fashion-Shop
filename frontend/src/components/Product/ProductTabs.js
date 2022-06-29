import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  listProducts,
  listLatestProducts,
  listSaleProducts,
} from '../../actions/productActions';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import ProductCard from './ProductCard';
import { Button, CircularProgress, Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} component='div'>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
    wrapped: true,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    boxShadow: 'none',
  },
  tabs: {
    backgroundColor: theme.palette.background.paper,
    '& .MuiTabs-flexContainer': {
      justifyContent: 'center',
    },
  },
  tab: {
    textTransform: 'capitalize',
    fontSize: '1rem',
    '@media (max-width: 400px)': {
      fontSize: '12px',
    },
  },
  buttonMore: {
    marginTop: 30,
    ...theme.mixins.customize.centerFlex(),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginTop: 40,
    marginBottom: 40,
  },
}));

const ProductTabs = () => {
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');

  const productLatest = useSelector((state) => state.productLatest);
  const {
    loading: loadingProductLatest,
    error: errorProductLatest,
    products: productsLatest,
  } = productLatest;

  const productSale = useSelector((state) => state.productSale);
  const {
    loading: loadingProductSale,
    error: errorProductSale,
    products: productsSale,
  } = productSale;

  const productList = useSelector((state) => state.productList);
  const {
    loading: loadingProductList,
    error: errorProductList,
    products: productsList,
  } = productList;

  useEffect(() => {
    dispatch(listLatestProducts());
  }, [dispatch]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 1 && !productsSale.length) {
      dispatch(listSaleProducts());
    } else if (newValue === 2 && !productsList.length) {
      dispatch(listProducts());
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position='static' className={classes.appBar}>
        <Tabs
          variant={matches ? 'scrollable' : 'standard'}
          value={value}
          onChange={handleChange}
          aria-label='tabs product'
          indicatorColor='secondary'
          textColor='secondary'
          className={classes.tabs}
        >
          <Tab
            className={classes.tab}
            label='Latest Arrivals'
            {...a11yProps(0)}
          />
          <Tab
            className={classes.tab}
            label='Sale Products'
            {...a11yProps(1)}
          />
          <Tab className={classes.tab} label='All Products' {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Grid container spacing={4}>
          {loadingProductLatest ? (
            <div className={classes.loading}>
              <CircularProgress color='secondary' />
            </div>
          ) : errorProductLatest ? (
            <Alert severity='error'>{errorProductLatest}</Alert>
          ) : (
            productsLatest.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard {...product} />
              </Grid>
            ))
          )}
        </Grid>
        <div className={classes.buttonMore}>
          <Button
            variant='contained'
            color='secondary'
            component={Link}
            to='/shop?sort_by=latest'
          >
            Discover More
          </Button>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid container spacing={4}>
          {loadingProductSale ? (
            <div className={classes.loading}>
              <CircularProgress color='secondary' />
            </div>
          ) : errorProductSale ? (
            <Alert severity='error'>{errorProductSale}</Alert>
          ) : (
            productsSale.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard {...product} />
              </Grid>
            ))
          )}
        </Grid>
        <div className={classes.buttonMore}>
          <Button
            variant='contained'
            color='secondary'
            component={Link}
            to='/shop?sort_by=sale'
          >
            Discover More
          </Button>
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Grid container spacing={4}>
          {loadingProductList ? (
            <div className={classes.loading}>
              <CircularProgress color='secondary' />
            </div>
          ) : errorProductList ? (
            <Alert severity='error'>{errorProductList}</Alert>
          ) : (
            productsList.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard {...product} />
              </Grid>
            ))
          )}
        </Grid>
        <div className={classes.buttonMore}>
          <Button
            variant='contained'
            color='secondary'
            component={Link}
            to='/shop'
          >
            Discover More
          </Button>
        </div>
      </TabPanel>
    </div>
  );
};

export default ProductTabs;
