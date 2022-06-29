import React from 'react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../actions/cartActions';
import { openSnackbar } from '../../actions/snackbarActions';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from '@material-ui/core';
import { AiOutlineSync } from 'react-icons/ai';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      marginLeft: theme.spacing(1),
    },
  },
}));

const ProductFormSelect = ({ item, className }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { control, handleSubmit } = useForm();
  const updateCartHandler = (data, id) => {
    dispatch(addToCart(id, data.qty, data.size));
    dispatch(openSnackbar('Item has been updated', 'success'));
  };

  return (
    <form
      className={clsx(classes.root, className && className)}
      onSubmit={handleSubmit((data) => {
        updateCartHandler(data, item.product);
      })}
    >
      <FormControl variant='outlined' size='small'>
        <InputLabel shrink id='size-select-label'>
          Size
        </InputLabel>
        <Controller
          name='size'
          control={control}
          defaultValue={item.sizeSelected}
          render={({ field }) => (
            <Select {...field} label='Size' autoWidth>
              {Object.keys(item.size).map((value) =>
                item.size[value] > 0 ? (
                  <MenuItem value={value} key={value}>
                    {value.toUpperCase()}
                  </MenuItem>
                ) : null
              )}
            </Select>
          )}
        />
      </FormControl>
      <FormControl variant='outlined' size='small'>
        <InputLabel shrink id='quantity-select-label'>
          Qty
        </InputLabel>
        <Controller
          name='qty'
          control={control}
          defaultValue={item.qty}
          render={({ field }) => (
            <Select {...field} label='Qty' autoWidth>
              {Array(item.countInStock)
                .fill()
                .map((item, index) => (
                  <MenuItem value={index + 1} key={index + 1}>
                    {index + 1}
                  </MenuItem>
                ))}
            </Select>
          )}
        />
      </FormControl>
      <Button
        type='submit'
        variant='contained'
        color='secondary'
        size='small'
        startIcon={<AiOutlineSync color='#fff' />}
        disableElevation
      >
        Update
      </Button>
    </form>
  );
};

export default ProductFormSelect;
