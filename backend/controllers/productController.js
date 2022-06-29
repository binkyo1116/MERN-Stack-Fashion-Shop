import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

/**
 * @desc    Fetch all products
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res) => {
  if (req.query.option === 'all') {
    const products = await Product.find({});
    res.json({ products });
  } else {
    const perPage = 12;
    const page = parseInt(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(perPage)
      .skip(perPage * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / perPage), count });
  }
});

/**
 * @desc    Fetch single product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({
      message: 'Product not found',
    });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({ ...req.body, user: req.user._id });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    sale,
    images,
    brand,
    category,
    description,
    size,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.sale = sale || product.sale;
    product.description = description || product.description;
    product.images = images || product.images;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.size = size || product.size;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 12;
  const page = parseInt(req.query.pageNumber) || 1;
  const count = await Product.countDocuments({});
  const products = await Product.find({})
    .sort({ rating: -1 })
    .limit(perPage)
    .skip(perPage * (page - 1));

  res.json({ page, pages: Math.ceil(count / perPage), products, count });
});

/**
 * @desc    Get latest products
 * @route   GET /api/products/latest
 * @access  Public
 */
const getLatestProducts = asyncHandler(async (req, res) => {
  const perPage = 12;
  const page = parseInt(req.query.pageNumber) || 1;
  const count = await Product.countDocuments({});

  const products = await Product.find({})
    .sort({ createdAt: 'desc' })
    .limit(perPage)
    .skip(perPage * (page - 1));

  res.json({ page, pages: Math.ceil(count / perPage), products, count });
});

/**
 * @desc    Get sale products
 * @route   GET /api/products/sale
 * @access  Public
 */
const getSaleProducts = asyncHandler(async (req, res) => {
  const perPage = 12;
  const page = parseInt(req.query.pageNumber) || 1;
  const count = await Product.countDocuments({ sale: { $gt: 0 } });

  const products = await Product.find({ sale: { $gt: 0 } })
    .sort({ sale: 'desc' })
    .limit(perPage)
    .skip(perPage * (page - 1));

  res.json({ page, pages: Math.ceil(count / perPage), products, count });
});

/**
 * @desc    Get related products
 * @route   GET /api/products/sale
 * @access  Public
 */
const getRelatedProducts = asyncHandler(async (req, res) => {
  const category = req.query.category || 'clothes';
  const perPage = 4;
  const page = req.query.pageNumber || 1;
  const count = await Product.countDocuments({ category });

  const products = await Product.find({ category })
    .limit(perPage)
    .skip(perPage * (page - 1));

  res.json({ page, pages: Math.ceil(count / perPage), products });
});

/**
 * @desc    Get products sort by price
 * @route   GET /api/products/price
 * @access  Public
 */
const getSortByPriceProducts = asyncHandler(async (req, res) => {
  const sortBy = req.query.sortBy || 'asc';

  const perPage = 12;
  const page = parseInt(req.query.pageNumber) || 1;
  const skipCount = perPage * (page - 1);
  const count = await Product.countDocuments({});

  const products = await Product.aggregate([
    {
      $project: {
        // _id: 1,
        price: 1,
        sale: 1,
        size: 1,
        images: 1,
        rating: 1,
        numReviews: 1,
        countInStock: 1,
        name: 1,
        brand: 1,
        category: 1,
        description: 1,
        user: 1,
        reviews: 1,
        createdAt: 1,
        updatedAt: 1,
        priceSale: {
          $subtract: ['$price', { $multiply: ['$price', '$sale', 0.01] }],
        },
      },
    },
    { $sort: { priceSale: sortBy === 'asc' ? 1 : -1 } },
    { $skip: skipCount },

    { $limit: perPage },
  ]);

  res.json({ page, pages: Math.ceil(count / perPage), products, count });
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getLatestProducts,
  getSaleProducts,
  getRelatedProducts,
  getSortByPriceProducts,
};
