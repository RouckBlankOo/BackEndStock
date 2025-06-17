const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  color: { type: String, required: true },
  size: { type: String, required: true },
  action: {
    type: String,
    enum: ['add', 'remove', 'sell', 'return', 'update'], // 'sell' for selling products, 'return' for returning products
    required: true
  },
  quantityChange: { type: Number, required: true }, // can be 1 or or 2 
  previousQuantity: { type: Number, required: true }, // previous quantity before change
  newQuantity: { type: Number, required: true }, // new quantity after change
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('StockHistory', stockHistorySchema);



// const Product = require('./models/Product');
// const StockHistory = require('./models/StockHistory');

// /**
//  * Update stock quantities and record history
//  * @param {String} productId - Product ID
//  * @param {String} size - Size for all updates
//  * @param {Array<{ color: string, quantity: number }>} updates - Array of updates
//  */
// async function updateProductStocksWithHistory(productId, size, updates) {
//   try {
//     const product = await Product.findById(productId);
//     if (!product) {
//       throw new Error('Product not found');
//     }

//     for (const { color, quantity } of updates) {
//       const stockIndex = product.stocks.findIndex(
//         (s) => s.color === color && s.size === size
//       );

//       if (stockIndex !== -1) {
//         // Add quantity to existing stock
//         product.stocks[stockIndex].quantity += quantity;
//       } else {
//         // If not found, create new stock
//         product.stocks.push({ color, size, quantity });
//       }

//       // Save history
//       const historyEntry = new StockHistory({
//         product: product._id,
//         color,
//         size,
//         quantityChange: quantity,
//       });
//       await historyEntry.save();
//     }

//     product.updatedAt = Date.now();
//     await product.save();

//     console.log('Stocks updated and history recorded successfully');
//     return product;
//   } catch (error) {
//     console.error('Error updating stocks:', error.message);
//     throw error;
//   }
// }

// module.exports = updateProductStocksWithHistory;


// const updateProductStocksWithHistory = require('./updateProductStocksWithHistory');

// (async () => {
//   try {
//     await updateProductStocksWithHistory(
//       '6635123456abcdef7890cdef', // product ID
//       'XL',                      // size
//       [
//         { color: 'red', quantity: 2 },
//         { color: 'green', quantity: 3 }
//       ]
//     );
//   } catch (err) {
//     console.error('Update failed:', err.message);
//   }
// })();
