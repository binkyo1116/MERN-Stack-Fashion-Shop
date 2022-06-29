import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
  Typography,
  Button,
  Box,
  Divider,
  Slider,
  RadioGroup,
  Radio,
  Hidden,
  FormControl,
  FormControlLabel,
  AccordionSummary,
  AccordionDetails,
  Accordion,
  useMediaQuery,
} from '@material-ui/core';
import {
  addRangePrice,
  addCategories,
  addSize,
  addBrands,
} from '../../actions/filterActions';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchBox from '../SearchBox';
import categories from '../../assets/data/categories';
import brands from '../../assets/data/brands';

const INITIAL_RANGE_PRICE = [10, 400];

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(2, 0),
    [theme.breakpoints.down('sm')]: {
      margin: '4px 0',
    },
  },
  title: {
    color: '#4D4D4D',
    fontSize: 18,
    [theme.breakpoints.down('lg')]: {
      fontSize: 16,
    },
  },
  category: {
    ...theme.mixins.customize.flexMixin('flex-start', 'flex-start', 'column'),
    '& > .MuiBox-root + .MuiBox-root': {
      marginTop: theme.spacing(2),
    },
    '& > .MuiBox-root': {
      cursor: 'pointer',
    },
  },
  brands: {
    '& > button': {
      paddingLeft: 0,
      paddingRight: 0,
      minWidth: 0,
      textTransform: 'capitalize',
      color: 'rgba(0, 0, 0, 0.54)',
    },
    '& > button:hover': {
      backgroundColor: 'transparent',
    },
  },
  size: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    '& span': {
      fontSize: 14,
    },
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      flexWrap: 'wrap',
    },
  },
  accordion: {
    '&::before': {
      display: 'none',
    },
    boxShadow: 'none',
    '& .MuiAccordionSummary-root': {
      padding: 0,
    },
    '& .MuiAccordionDetails-root': {
      display: 'block',
      padding: 0,
    },
  },
  isSelected: {
    color: '#111 !important',
  },
}));

const ProductFilterBar = ({ products, sizeSelected, filter }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const onMobile = useMediaQuery('(max-width:740px)');
  const [expanded, setExpanded] = useState([
    'priceRange',
    'categories',
    'size',
    'brands',
  ]);
  const [price, setPrice] = useState(INITIAL_RANGE_PRICE);
  const [size, setSize] = useState('');

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(
      isExpanded ? [...expanded, panel] : expanded.filter((x) => x !== panel)
    );
  };

  const handlePriceChange = (e, newValue) => {
    setPrice(newValue);
  };

  const handleSizeChange = (newSize) => {
    setSize(newSize);
    addSizeHandler(newSize);
  };

  const addCategoriesHandler = (category) => {
    dispatch(addCategories(category));
  };

  const addSizeHandler = (size) => {
    dispatch(addSize(size));
  };

  const addBrandsHandler = (brand) => {
    dispatch(addBrands(brand));
  };

  useEffect(() => {
    if (price !== INITIAL_RANGE_PRICE) {
      const timer = setTimeout(
        () =>
          dispatch(
            addRangePrice({
              priceMin: price[0],
              priceMax: price[1],
            })
          ),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [dispatch, price]);

  useEffect(() => {
    if (!sizeSelected) {
      setSize('');
    }
  }, [sizeSelected]);

  useEffect(() => {
    if (onMobile) {
      setExpanded([]);
    }
  }, [onMobile]);

  return (
    <>
      <SearchBox />
      <Hidden smDown>
        <Divider className={classes.divider} />
      </Hidden>
      <Accordion
        className={classes.accordion}
        expanded={expanded.indexOf('priceRange') >= 0}
        onChange={handleAccordionChange('priceRange')}
        defaultExpanded={true}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' gutterBottom className={classes.title}>
            Filter By Pricing
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Slider
            value={price}
            onChange={handlePriceChange}
            max={500}
            min={1}
            color='secondary'
            valueLabelDisplay='auto'
            aria-labelledby='range-slider'
          />
          <Box
            display='flex'
            justifyContent='space-between'
            color='text.secondary'
          >
            <span>Filter</span>
            <span>{`Pricing $${price[0]} - $${price[1]}`}</span>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Divider className={classes.divider} />
      <Accordion
        className={classes.accordion}
        expanded={expanded.indexOf('categories') >= 0}
        onChange={handleAccordionChange('categories')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' gutterBottom className={classes.title}>
            Categories
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={classes.category} color='text.secondary'>
            {categories.map((category) => (
              <Box
                display='flex'
                justifyContent='space-between'
                width='100%'
                key={category}
                className={clsx(
                  filter.categories.indexOf(category) >= 0 && classes.isSelected
                )}
                onClick={() => addCategoriesHandler(category)}
              >
                <span>{category}</span>
                <span>
                  (
                  {products.reduce(
                    (acc, product) =>
                      product.category === category ? ++acc : acc,
                    0
                  )}
                  )
                </span>
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Divider className={classes.divider} />
      <Accordion
        className={classes.accordion}
        expanded={expanded.indexOf('size') >= 0}
        onChange={handleAccordionChange('size')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' gutterBottom className={classes.title}>
            Size
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth component='fieldset'>
            <RadioGroup
              className={classes.size}
              value={size}
              onChange={(e) => handleSizeChange(e.target.value)}
            >
              {['s', 'm', 'l', 'xl'].map((value) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio />}
                  label={value.toUpperCase()}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Divider className={classes.divider} />
      <Accordion
        className={classes.accordion}
        expanded={expanded.indexOf('brands') >= 0}
        onChange={handleAccordionChange('brands')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6' gutterBottom className={classes.title}>
            Brands
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={classes.brands} color='text.secondary'>
            {brands.map((brand, index) => (
              <Button
                disableElevation
                disableFocusRipple
                disableRipple
                key={brand}
                className={clsx(
                  filter.brands.indexOf(brand) >= 0 && classes.isSelected
                )}
                onClick={() => addBrandsHandler(brand)}
              >
                {brand}
                {index !== brands.length - 1 && (
                  <span style={{ margin: '0 8px' }}>/</span>
                )}
              </Button>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default ProductFilterBar;
