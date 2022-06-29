import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import AddShoppingCartOutlinedIcon from '@material-ui/icons/AddShoppingCartOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import { RiShoppingBag3Fill } from 'react-icons/ri';
import Tooltip from '@material-ui/core/Tooltip';
import ProductModalView from './ProductModalView';
import { Button, CardActionArea, Hidden, IconButton } from '@material-ui/core';
import { addToCart, setOpenCartDrawer } from '../../actions/cartActions';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: `0px 0px 0px 0px rgb(0 0 0 / 0%), 
                0px 1px 1px 0px rgb(0 0 0 / 0%), 
                0px 1px 0px 1px rgb(0 0 0 / 4%)`,
    '&:hover $mediaFront': {
      opacity: 0,
    },
    '&:hover $groupAction': {
      transform: 'translate(0, -50%)',
    },
  },
  mediaWrapper: {
    position: 'relative',
    paddingTop: '133.33333%', // 3:4 aspect ratio (4/3=133.33)
  },
  media: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: 'cover',
    height: '100%',
  },
  mediaFront: {
    transition: 'opacity .4s',
  },
  groupAction: {
    position: 'absolute',
    top: 65,
    right: 10,
    transform: 'translate(120%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent',
    transition: 'all .3s ease-in-out',
    zIndex: 1,
    '& a + a': {
      paddingTop: '10px',
    },
    '& svg': {
      color: '#999',
    },
    '& button:hover svg': {
      color: '#fb5d5d',
    },
    '& .MuiIconButton-root': {
      backgroundColor: 'rgba(255,255,255,0.5)',
      margin: '4px 0',
    },
  },
  sale: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: '0px 6px',
    color: '#fff',
    fontSize: 12,
    fontWeight: 400,
    textTransform: 'uppercase',
    lineHeight: 1.5,
    backgroundColor: theme.palette.secondary.main,
    zIndex: 1,
  },
  mediaMobile: {
    ...theme.mixins.customize.flexMixin(
      'space-between',
      'center',
      'row',
      'wrap'
    ),
    '@media (max-width: 740px)': {
      flexWrap: 'wrap',
      '& > button': {
        backgroundColor: 'rgba(245, 0, 87, 0.05) !important',
        flexBasis: '100%',
        marginTop: 10,
      },
    },
  },
  price: {
    fontSize: '1rem',
    fontWeight: 600,
    color: (props) => props.sale > 0 && '#f50057',
  },
  rootPrice: {
    textDecoration: 'line-through',
  },
}));

const ProductCard = (props) => {
  const { _id, name, images, price, sale } = props;
  const [openModal, setOpenModal] = useState(false);
  const classes = useStyles(props);
  const dispatch = useDispatch();

  const handleAddToCart = (e, id) => {
    e.preventDefault();
    dispatch(setOpenCartDrawer(true));
    dispatch(addToCart(id, 1, 'm'));
  };
  const handleOpenQuickView = (e) => {
    e.preventDefault();
    setOpenModal(true);
  };

  return (
    <>
      <Card className={classes.root}>
        <CardActionArea component={RouterLink} to={`/product/${_id}`}>
          <div className={classes.mediaWrapper}>
            {sale > 0 && <div className={classes.sale}>{`- ${sale}% `}</div>}

            <Hidden smDown>
              <div className={classes.groupAction}>
                <Tooltip title='Quick views' placement='right-start' arrow>
                  <IconButton onClick={handleOpenQuickView}>
                    <VisibilityOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Add to cart' placement='right' arrow>
                  <IconButton onClick={(e) => handleAddToCart(e, _id)}>
                    <AddShoppingCartOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Hidden>

            <CardMedia
              className={classes.media}
              component={'img'}
              src={images && images[1]}
            />
            <CardMedia
              className={clsx(classes.media, classes.mediaFront)}
              component={'img'}
              src={images && images[0]}
            />
          </div>
          <CardContent component='div' style={{ paddingBottom: 10 }}>
            <Tooltip title={name || ''}>
              <Typography
                gutterBottom
                variant='subtitle1'
                component='div'
                noWrap
              >
                {name}
              </Typography>
            </Tooltip>
            <div className={classes.mediaMobile}>
              <Typography
                variant='subtitle2'
                color='textPrimary'
                component='div'
                className={classes.price}
                noWrap
              >
                {sale ? (
                  <Typography
                    variant='subtitle2'
                    color='textSecondary'
                    component='span'
                    className={classes.rootPrice}
                  >
                    ${(price * 1).toFixed(2)}
                  </Typography>
                ) : null}
                {'  '}${(price * (1 - sale / 100)).toFixed(2)}
              </Typography>
              <Hidden mdUp>
                <Tooltip title='Add to cart' placement='bottom' arrow>
                  <Button
                    onClick={(e) => handleAddToCart(e, _id)}
                    color='secondary'
                    className={classes.cartMobile}
                    startIcon={<RiShoppingBag3Fill />}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Add to Cart
                  </Button>
                </Tooltip>
              </Hidden>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
      <ProductModalView
        {...props}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};

export default ProductCard;
