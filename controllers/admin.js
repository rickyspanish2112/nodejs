const e = require('express');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, price, description);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  
  console.log('Request made to edit a product');
  
  const editMode = req.query.edit;
  console.log('Query value ' + editMode);

  if (!editMode) {
    return res.redirect('/');
  }

  const prodId = req.params.productId;
  console.log('Product id:'+ prodId);
  Product.findById(prodId, product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product', 
      formsCSS: true,
      productCSS: true,
      editing: editMode,
      product: product
    });

    console.log('Product title: ' + product.title)
    console.log('Product price: ' + product.price)
    console.log('Image URL ' + product.imageUrl)
    console.log('Description ' + product.description)
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  
  console.log('Received request to update product with ID:' + prodId);

  console.log('Following data will be updated:' + 
  ' ' + updatedTitle + 
  ' ' + updatedPrice + 
  ' ' + updatedImageUrl + 
  ' ' + updatedDesc );
  
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedPrice,
    updatedDesc,
    
  );
  updatedProduct.save();
  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      hasProducts: products.length > 0,
      activeAddAdminProducts: true,
      formsCSS: true,
      productCSS: true,
    });
  });
};

exports.postDeleteProduct = (req, res, next) =>{
  const prodId = req.body.productId;
  Product.deleteId(prodId);
  res.redirect('/admin/products');
};