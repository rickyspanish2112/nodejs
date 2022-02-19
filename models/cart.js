const fs = require('fs');
const path = require('path');


//module.exports = path.dirname(require.main.filename);

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice; //Adding a + directly before productPrice converts the string to a number!! 
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }

      const updatedCart = { ...JSON.parse(fileContent)};
      const product = updatedCart.products.find(prod => prod.id === id);

      if(!product){
        
        console.log('No matching product found in cart when trying to delete product with ID mathing' + id);ß
        return;
      }

      const productQty = product.qty;
      
      updatedCart.products = updatedCart.products.filter(
        prod => prod.id !== id
      );
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
