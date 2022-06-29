import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { openSnackbar } from '../actions/snackbarActions';
import { createProduct } from '../actions/productActions';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Paper,
  TextField,
  Container,
  Button,
  Link,
  Box,
  Grid,
  Breadcrumbs,
  InputAdornment,
  InputLabel,
  IconButton,
  MenuItem,
} from '@material-ui/core';
import Meta from '../components/Meta';
import ProductCard from '../components/Product/ProductCard';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { MdCloudUpload, MdClose } from 'react-icons/md';
import categories from '../assets/data/categories';

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    '& .MuiBreadcrumbs-ol': {
      justifyContent: 'flex-start',
    },
  },
  form: {
    '& > *': {
      marginBottom: 16,
    },
    '& .MuiInput-underline:before': {
      borderColor: 'rgba(224, 224, 224, 1)',
    },
  },
  container: {
    marginBottom: 64,
    boxShadow: '0 10px 31px 0 rgba(0,0,0,0.05)',
  },
  size: {
    marginTop: 8,
    '& > div': {
      display: 'flex',
      flexBasis: '25%',
      '& > div + div': {
        marginLeft: 16,
      },
      marginTop: 16,
    },
    '& > label': {
      flexBasis: '100%',
    },
  },
  imagePreview: {
    position: 'relative',
    marginTop: 8,
    marginRight: 16,
    '& > img': {
      width: 120,
      height: 160,
      objectFit: 'cover',
      borderRadius: 6,
    },
    '& .MuiIconButton-root': {
      position: 'absolute',
      top: 5,
      right: 5,
    },
  },
  preview: {
    backgroundColor: theme.palette.background.default,
    '& img.MuiCardMedia-media': {
      height: '100%',
    },
  },
}));

const ProductCreateScreen = ({ history }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [sale, setSale] = useState(0);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [sizeS, setSizeS] = useState(0);
  const [sizeM, setSizeM] = useState(0);
  const [sizeL, setSizeL] = useState(0);
  const [sizeXl, setSizeXl] = useState(0);
  const [description, setDescription] = useState('');

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = productCreate;

  useEffect(() => {
    if (successCreate) {
      dispatch(openSnackbar('Product has been created!', 'success'));
      history.push('/admin/productlist');
    }
  }, [dispatch, history, successCreate]);

  const handleRemovePreviewImages = (removeImage) => {
    const newPreviewImages = previewImages.filter(
      (image) => image !== removeImage
    );
    setPreviewImages(newPreviewImages);
  };

  const handleImagesUpload = (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files);
    setImages([...images, ...filesArray]);
    const imagesUrl = filesArray.map((image) => URL.createObjectURL(image));
    setPreviewImages([...previewImages, ...imagesUrl]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    let uploadedImages = [];
    const formData = new FormData();

    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
      setUploading(true);
      try {
        let { data: response } = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        uploadedImages = [...response.data.map((item) => item.url)];
      } catch (error) {
        console.log(error);
        setUploading(false);
      }

      const countInStock = parseInt(sizeS) + parseInt(sizeM)
        + parseInt(sizeL) + parseInt(sizeXl);

      const product = {
        name,
        price,
        sale,
        images: uploadedImages.length !== 0 ? uploadedImages : null,
        brand,
        category,
        description,
        size: { s: sizeS, m: sizeM, l: sizeL, xl: sizeXl },
        countInStock,
      };
      dispatch(createProduct(product));
    }
  };

  return (
    <Container maxWidth='xl' style={{ marginBottom: 48 }}>
      <Meta title='Create Product' />
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
            <Link
              color='inherit'
              component={RouterLink}
              to='/admin/productlist'
            >
              Products
            </Link>
            <Link
              color='textPrimary'
              component={RouterLink}
              to={`/admin/product/create`}
            >
              Create
            </Link>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Grid
        container
        component={Paper}
        elevation={0}
        spacing={8}
        className={classes.container}
      >
        <Grid item xs={12} lg={9}>
          <Typography
            variant='h5'
            component='h1'
            gutterBottom
            style={{ textAlign: 'center' }}
          >
            Create Product
          </Typography>
          {loadingCreate && <Loader />}
          {errorCreate && <Message>{errorCreate}</Message>}
          <form onSubmit={submitHandler} className={classes.form}>
            <TextField
              variant='outlined'
              required
              name='name'
              label='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <Box display='flex' justifyContent='space-between'>
              <TextField
                variant='outlined'
                required
                name='price'
                type='number'
                inputProps={{ min: 0, step: 0.01 }}
                label='Price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>$</InputAdornment>
                  ),
                }}
                style={{ flexBasis: '50%', marginRight: 8 }}
              />

              <TextField
                variant='outlined'
                required
                name='sale'
                type='number'
                inputProps={{ min: 0 }}
                label='Sale'
                value={sale}
                onChange={(e) => setSale(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>%</InputAdornment>
                  ),
                }}
                style={{ flexBasis: '50%', marginLeft: 8 }}
              />
            </Box>

            <div>
              <InputLabel style={{ marginBottom: 8 }}>Upload images</InputLabel>
              <input
                accept='image/*'
                id='contained-button-file'
                multiple
                onChange={handleImagesUpload}
                type='file'
                hidden
              />
              <label htmlFor='contained-button-file'>
                <Button
                  variant='contained'
                  color='secondary'
                  startIcon={<MdCloudUpload />}
                  component='span'
                >
                  Upload
                </Button>
              </label>
              <Box my={2} display='flex' flexWrap='wrap'>
                {previewImages.map((image) => (
                  <div className={classes.imagePreview} key={image}>
                    <img src={image} alt='' />
                    <IconButton
                      size='small'
                      onClick={() => handleRemovePreviewImages(image)}
                    >
                      <MdClose />
                    </IconButton>
                  </div>
                ))}
              </Box>
            </div>

            <TextField
              variant='outlined'
              required
              name='brand'
              label='Brand'
              fullWidth
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />

            <div className={classes.size}>
              <InputLabel>Count In Stock</InputLabel>
              <div>
                <TextField
                  variant='outlined'
                  required
                  type='number'
                  inputProps={{ min: 0 }}
                  name='s'
                  label='Size S'
                  value={sizeS}
                  onChange={(e) => setSizeS(e.target.value)}
                />

                <TextField
                  variant='outlined'
                  required
                  type='number'
                  inputProps={{ min: 0 }}
                  name='m'
                  label='Size M'
                  value={sizeM}
                  onChange={(e) => setSizeM(e.target.value)}
                />

                <TextField
                  variant='outlined'
                  required
                  type='number'
                  inputProps={{ min: 0 }}
                  name='l'
                  label='Size L'
                  value={sizeL}
                  onChange={(e) => setSizeL(e.target.value)}
                />

                <TextField
                  variant='outlined'
                  required
                  type='number'
                  inputProps={{ min: 0 }}
                  name='xl'
                  label='Size XL'
                  value={sizeXl}
                  onChange={(e) => setSizeXl(e.target.value)}
                />
              </div>
            </div>

            <TextField
              select
              variant='outlined'
              required
              name='category'
              label='Category'
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              variant='outlined'
              required
              name='description'
              label='Description'
              fullWidth
              multiline
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button type='submit' variant='contained' color='secondary'>
              Submit
            </Button>
          </form>
          {images.length === 0 && <Message>Please upload images!!</Message>}
          {uploading && <Loader />}
        </Grid>
        <Grid item xs={12} lg={3} className={classes.preview}>
          <ProductCard
            _id={''}
            name={name}
            images={
              previewImages.length !== 0
                ? previewImages
                : [
                    'https://via.placeholder.com/300x400?text=Fashion+Shop',
                    'https://via.placeholder.com/300x400?text=Fashion+Shop',
                  ]
            }
            price={price}
            sale={sale}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductCreateScreen;
