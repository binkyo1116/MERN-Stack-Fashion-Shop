import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import queryString from 'query-string';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import ProductFilterBar from '../components/Product/ProductFilterBar';
import {
  listShopProduct,
  filterListShopProduct,
} from '../actions/productActions';
import {
  removeSearchTerm,
  removeRangePrice,
  removeCategory,
  removeSize,
  removeBrand,
  filterClearAll,
} from '../actions/filterActions';
import {
  Container,
  Link,
  Box,
  Grid,
  Breadcrumbs,
  FormControl,
  Select,
  MenuItem,
  FormLabel,
  Chip,
  useMediaQuery,
} from '@material-ui/core';
import { PaginationItem, Pagination } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import Meta from '../components/Meta';
import ProductCard from '../components/Product/ProductCard';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { RiLayoutGridFill, RiLayoutFill } from 'react-icons/ri';

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
    marginBottom: 20,
    '& .MuiBreadcrumbs-ol': {
      justifyContent: 'flex-start',
    },
  },
  container: {
    marginBottom: 64,
    boxShadow: '0 10px 31px 0 rgba(0,0,0,0.05)',
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    '& label': {
      color: '#2a2a2a',
      paddingRight: 12,
    },
    '& .MuiOutlinedInput-input': {
      paddingTop: 6,
      paddingBottom: 6,
      color: 'rgba(0, 0, 0, 0.54) ',
      fontSize: 15,
    },
    '& .MuiInputBase-formControl': {
      borderRadius: 4,
      marginRight: theme.spacing(6),
    },
  },
  layoutIcon: {
    ...theme.mixins.customize.centerFlex('column'),
    padding: 4,
    cursor: 'pointer',
    '& + $layoutIcon': {
      marginLeft: 8,
    },
  },
  activeLayout: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
  },
  topFilter: {
    ...theme.mixins.customize.flexMixin(
      'space-between',
      'center',
      'row',
      'wrap'
    ),
    boxShadow:
      'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
    padding: 22,
    marginBottom: theme.spacing(5),
    // '& .MuiChip-root + .MuiChip-root': {
    //   marginLeft: 12,
    // },
    '& .MuiChip-root': {
      margin: 4,
    },
  },
  pagination: {
    flexBasis: '100%',
    marginTop: 16,
    marginBottom: 16,
    '& .MuiPagination-ul': {
      justifyContent: 'flex-end',
    },
  },
}));

const ShopScreen = ({ location, history }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const onExtraSmallMobile = useMediaQuery('(max-width:460px)');

  const ref = useRef();

  const [activeLayout, setActiveLayout] = useState('moreCol');

  const query = queryString.parse(location.search);
  let { sort_by = 'default', page: pageNumber = 1 } = query;

  const productShop = useSelector((state) => state.productShop);
  const { loading, error, products, page, pages } = productShop;

  const filter = useSelector((state) => state.filter);
  const { searchTerm, categories, brands, size, priceMax, priceMin } = filter;

  const handleChangeLayout = (type) => {
    setActiveLayout(type);
  };

  useEffect(() => {
    dispatch(listShopProduct(sort_by, pageNumber, searchTerm));
  }, [dispatch, sort_by, pageNumber, searchTerm]);

  useEffect(() => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }, [pageNumber]);

  useEffect(() => {
    dispatch(filterListShopProduct());
  }, [dispatch, filter, page]);

  useEffect(() => {
    if (onExtraSmallMobile) {
      setActiveLayout('fewCol');
    }
  }, [onExtraSmallMobile]);

  return (
    <Container style={{ marginBottom: 140, maxWidth: '100%' }}>
      <Meta title='Shop' />
      <Grid container className={classes.breadcrumbsContainer} ref={ref}>
        <Grid item xs={12}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' />}
            style={{ marginBottom: 24 }}
          >
            <Link color='inherit' component={RouterLink} to='/'>
              Home
            </Link>
            <Link color='textPrimary' component={RouterLink} to='/shop'>
              Shop
            </Link>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Grid container spacing={4} style={{ backgroundColor: '#fff' }}>
        <Grid item xs={12} md={3}>
          <ProductFilterBar
            products={products}
            sizeSelected={size}
            filter={filter}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <Box className={classes.topFilter}>
            <div>
              <FormControl variant='outlined' className={classes.selectBox}>
                <FormLabel>Sort by</FormLabel>
                <Select
                  value={sort_by}
                  onChange={(e) =>
                    history.push(`/shop?sort_by=${e.target.value}`)
                  }
                >
                  <MenuItem value='default'>Default Sorting</MenuItem>
                  <MenuItem value='latest'>Lastest</MenuItem>
                  <MenuItem value='rating'>Rating</MenuItem>
                  <MenuItem value='sale'>Sale</MenuItem>
                  <MenuItem value='priceAsc'>Price: Low to High</MenuItem>
                  <MenuItem value='priceDesc'>Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div style={{ display: 'flex' }}>
              <span
                className={clsx(
                  classes.layoutIcon,
                  activeLayout === 'fewCol' && classes.activeLayout
                )}
                onClick={() => handleChangeLayout('fewCol')}
              >
                <RiLayoutFill fontSize={16} />
              </span>
              <span
                className={clsx(
                  classes.layoutIcon,
                  activeLayout === 'moreCol' && classes.activeLayout
                )}
                onClick={() => handleChangeLayout('moreCol')}
              >
                <RiLayoutGridFill fontSize={16} />
              </span>
            </div>
            <Box mt={2} style={{ flexBasis: '100%' }}>
              {searchTerm && (
                <Chip
                  variant='outlined'
                  size='small'
                  label={`Keyword: ${searchTerm}`}
                  onDelete={() => dispatch(removeSearchTerm())}
                />
              )}
              {priceMin && (
                <Chip
                  variant='outlined'
                  size='small'
                  label={`Above: $${priceMin}`}
                  onDelete={() => dispatch(removeRangePrice('min'))}
                />
              )}
              {priceMax && (
                <Chip
                  variant='outlined'
                  size='small'
                  label={`Below: $${priceMax}`}
                  onDelete={() => dispatch(removeRangePrice('max'))}
                />
              )}
              {categories.map((category) => (
                <Chip
                  variant='outlined'
                  size='small'
                  key={category}
                  label={category}
                  onDelete={() => dispatch(removeCategory(category))}
                />
              ))}
              {size && (
                <Chip
                  variant='outlined'
                  size='small'
                  label={`Size: ${size.toUpperCase()}`}
                  onDelete={() => dispatch(removeSize())}
                />
              )}
              {brands.map((brand) => (
                <Chip
                  variant='outlined'
                  size='small'
                  key={brand}
                  label={brand}
                  onDelete={() => dispatch(removeBrand(brand))}
                />
              ))}
            </Box>
          </Box>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message>{error}</Message>
          ) : (
            <Grid container spacing={2}>
              {products.length !== 0 ? (
                products.map((product) => (
                  <Grid
                    item
                    xs={activeLayout === 'fewCol' ? 12 : 6}
                    sm={activeLayout === 'fewCol' ? 6 : 4}
                    lg={activeLayout === 'fewCol' ? 4 : 3}
                    key={product._id}
                  >
                    <ProductCard {...product} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Message severity='info' mt={0}>
                    No product found.{' '}
                    <Link
                      component={RouterLink}
                      to={`shop?sort_by=${sort_by}&page=1`}
                    >
                      Back
                    </Link>
                    {` or `}
                    <Link onClick={() => dispatch(filterClearAll())}>
                      Clear all filter
                    </Link>
                  </Message>
                </Grid>
              )}
              {pages > 1 && (
                <Pagination
                  className={classes.pagination}
                  page={page}
                  count={pages}
                  renderItem={(item) => (
                    <PaginationItem
                      component={RouterLink}
                      to={`/shop${
                        item.page === 0
                          ? ''
                          : `?sort_by=${sort_by}&page=${item.page}`
                      }`}
                      {...item}
                    />
                  )}
                />
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ShopScreen;
