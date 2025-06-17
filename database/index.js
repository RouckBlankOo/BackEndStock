const mongoose = require('mongoose');
const categorySchema = require('./models/category.schema');
const subCategorySchema = require('./models/sub-category.schema');
const productSchema = require('./models/product.schema');
const userSchema = require('./models/user.schema');
const loginHistorySchema = require('./models/login-history.schema');
const stockHistorySchema = require('./models/stock-history.schema');




const connectToDatabase = async (mongoUrl) => {
    try {
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = {
    connectToDatabase,
    Category: categorySchema,
    SubCategory: subCategorySchema,
    Product: productSchema,
    User: userSchema,
    LoginHistory: loginHistorySchema,
    StockHistory: stockHistorySchema,
};
