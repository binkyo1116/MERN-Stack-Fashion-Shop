import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { IconButton, Modal, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '75%',
    display: 'flex',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      overflowY: 'scroll',
      '& $imageWrapper, $content': {
        flexBasis: '100%',
        maxWidth: '100%',
      },
      '& $imageWrapper $image': {
        height: '100%',
        objectFit: 'cover',
      },
      '& $content': {
        overflowY: 'unset',
      },
    },
  },
  imageWrapper: {
    flexBasis: '50%',
    maxWidth: '50%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 'auto',
  },
  content: {
    flexBasis: '50%',
    maxWidth: '50%',
    margin: '30px 0 30px 30px',
    paddingRight: 30,
    overflowY: 'auto',
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 10,
  },
}));

const ProductModalView = (props) => {
  const classes = useStyles();

  return (
    <Modal open={props.openModal} onClose={() => props.setOpenModal(false)}>
      <div className={classes.wrapper}>
        <IconButton
          color='secondary'
          onClick={() => props.setOpenModal(false)}
          className={classes.closeButton}
        >
          <ClearIcon />
        </IconButton>
        <div className={classes.imageWrapper}>
          <img
            className={classes.image}
            src={props.images && props.images[0]}
            alt={props.name}
          />
        </div>
        <div className={classes.content}>
          <Typography
            variant='h3'
            component='h2'
            gutterBottom
            style={{ fontSize: 26, fontWeight: 500 }}
          >
            {props.name}
          </Typography>
          <Rating
            name='read-only'
            value={props.rating || 0}
            precision={0.5}
            readOnly
          />
          <Typography
            variant='caption'
            component='p'
            paragraph
            style={{ fontSize: 14, paddingTop: 10, whiteSpace: 'pre-wrap' }}
          >
            {props.description}
          </Typography>
          <Button
            variant='contained'
            color='secondary'
            component={RouterLink}
            to={`/product/${props._id}`}
          >
            View Details
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductModalView;
