import express from 'express';
import fs from 'fs';
import upload from '../config/multer.js';
import cloudinary from '../config/cloudinary.js';
const router = express.Router();

// Max count = 4 images
router.post('/', upload.array('images', 4), async (req, res) => {
  // Version 1:
  // const imagesUrl = req.files.map((file) => `/${file.path}`);
  // res.send(imagesUrl);

  // Version 2:
  const uploader = async (path) =>
    await cloudinary(path, 'fashionshop/products');

  if (req.method === 'POST') {
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }

    console.log(urls);

    res.status(200).json({
      message: 'Images uploaded successfully',
      data: urls,
    });
  } else {
    res.status(405).json({
      err: `${req.method} method not allowed`,
    });
  }
});

export default router;
