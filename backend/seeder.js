import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    const createdUser = await User.insertMany(users);

    const adminUser = createdUser[0];

    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser._id,
      reviews: [
        {
          name: adminUser.name,
          rating: product.rating,
          comment:
            'The clothes are very beautiful and stylish, in line with current trends',
          user: adminUser._id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }));

    await Product.insertMany(sampleProducts);

    console.log('Data Imported'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(`Error: ${error.message}.red`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('Data Destroy'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(`Error: ${error.message}.red`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
