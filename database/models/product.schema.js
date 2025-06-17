const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  color: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, default: 0, required: true },
}, { timestamps: true });

stockSchema.index({ color: 1, size: 1 }, { unique: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true },
  description: { type: String },
  price: { type: Number, required: true },
  barcode: { type: String, required: true, unique: true, index: true },
  stocks: [stockSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });

productSchema.pre('save', function(next) {
  if (this.isNew && !this.barcode) {
    this.barcode = this._id.toString();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);

// {
//     "name": "T-shirt",
//     "category": "66350b3f2c14d4f0a1f9c23a",
//     "subCategory": "66350b682c14d4f0a1f9c23b",
//     "description": "High quality cotton T-shirt",
//     "price": 20,
//     "stocks": [
//       { "color": "red", "size": "XL", "quantity": 15 },
//       { "color": "red", "size": "M", "quantity": 10 },
//       { "color": "blue", "size": "XXL", "quantity": 15 },
//       { "color": "green", "size": "XL", "quantity": 5 }
//     ]
//   }
  