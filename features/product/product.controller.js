const { Product, StockHistory, SubCategory, Category } = require("../../database");
const ResHandler = require("../../helpers/res.helper");
const { paginate } = require('../../helpers/paginate.helper');
const { default: mongoose } = require("mongoose");

const createProduct = async (req, res) => {
  // #swagger.tags = ['Products']
  const resHandler = new ResHandler();
  try {
    const { name, category, subCategory, description, price, stocks } = req.body;

    if (!name || !category || !subCategory || !price || !stocks) {
      resHandler.setError(400, 'Nom, catégorie, sous-catégorie, prix et stocks sont requis');
      return resHandler.send(res);
    }

    const categoryExists = await Category.exists({ _id: category });
    if (!categoryExists) {
      resHandler.setError(400, 'Catégorie invalide');
      return resHandler.send(res);
    }

    const subCategoryDoc = await SubCategory.findOne({ _id: subCategory, category });
    if (!subCategoryDoc) {
      resHandler.setError(400, 'Sous-catégorie invalide ou ne correspond pas à la catégorie');
      return resHandler.send(res);
    }

    const product = await Product.create({ name, category, subCategory, price, stocks, description });
    resHandler.setSuccess(201, 'Produit créé avec succès', product);
    return resHandler.send(res);
  } catch (error) {
    resHandler.setError(500, 'Erreur lors de la création du produit');
    return resHandler.send(res);
  }
};

const updateProductStock = async (req, res) => {
  // #swagger.tags = ['Products']
  const resHandler = new ResHandler();
  const { id } = req.params;
  const { quantityChange, action } = req.body;

  try {
    // Validate input
    if (!quantityChange || !action || !id) {
      resHandler.setError(400, 'Quantité de changement, action et ID du stock sont requis');
      return resHandler.send(res);
    }

    // Validate action
    const validActions = ['add', 'sell', 'update', 'remove', 'return'];
    if (!validActions.includes(action)) {
      resHandler.setError(400, 'Action invalide. Valeurs attendues: add, sell, update, remove, return');
      return resHandler.send(res);
    }

    // Convert stock ID and search for product by stock _id
    let stockId;
    try {
      stockId = new mongoose.Types.ObjectId(id);
      console.log("Searching for stock with ID:", stockId);
    } catch (error) {
      resHandler.setError(400, 'Format d\'ID de stock invalide');
      return resHandler.send(res);
    }

    const product = await Product.findOne({ 'stocks._id': stockId });
    console.log("Product found:", product);

    if (!product) {
      resHandler.setError(404, 'Produit non trouvé avec cet ID de stock');
      return resHandler.send(res);
    }

    // Find stock subdocument
    const stockIndex = product.stocks.findIndex(s => s._id.toString() === stockId.toString());
    if (stockIndex === -1) {
      resHandler.setError(400, 'Stock pour cette taille et couleur non trouvé');
      return resHandler.send(res);
    }

    // Get current stock details
    const previousQuantity = product.stocks[stockIndex].quantity;
    const color = product.stocks[stockIndex].color;
    const size = product.stocks[stockIndex].size;

    // Calculate new quantity
    const newQuantity =
      action === 'add'
        ? parseInt(previousQuantity) + parseInt(quantityChange)
        : action === 'sell'
        ? parseInt(previousQuantity) - parseInt(quantityChange)
        : action === 'update'
        ? parseInt(quantityChange)
        : action === 'remove'
        ? parseInt(previousQuantity) - parseInt(quantityChange)
        : action === 'return'
        ? parseInt(previousQuantity) + parseInt(quantityChange)
        : parseInt(previousQuantity);

    if (newQuantity < 0) {
      resHandler.setError(400, 'La quantité ne peut pas être négative');
      return resHandler.send(res);
    }

    // Update stock quantity
    product.stocks[stockIndex].quantity = newQuantity;
    await product.save();

    // Record stock history
    await StockHistory.create({
      product: product._id,
      user: req.user._id,
      color,
      size,
      action: action || 'update',
      quantityChange,
      previousQuantity,
      newQuantity,
    });

    // Send success response
    resHandler.setSuccess(200, 'Stock mis à jour avec succès', {
      productId: product._id,
      color,
      size,
      action,
      previousQuantity,
      newQuantity,
      quantityChange
    });
    return resHandler.send(res);

  } catch (error) {
    console.error("Error updating product stock:", error);
    resHandler.setError(500, 'Erreur lors de la mise à jour du stock');
    return resHandler.send(res);
  }
};


const updateProduct = async (req, res) => {
  // #swagger.tags = ['Products']
  const resHandler = new ResHandler();
  const { id } = req.params;
  const { name, category, subCategory, price, stocks, description } = req.body;
console.log("Update Product Request Body:", name, category, subCategory, price, stocks, description);

  try {
    // Validate product ID
    let productId;
    try {
      productId = new mongoose.Types.ObjectId(id);
    } catch (error) {
      resHandler.setError(400, 'Format d\'ID de produit invalide');
      return resHandler.send(res);
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) { 
      resHandler.setError(404, 'Produit non trouvé');
      return resHandler.send(res);
    }

    // Store original stocks for history comparison
    const originalStocks = [...product.stocks.map(s => ({
      _id: s._id,
      color: s.color,
      size: s.size,
      quantity: s.quantity
    }))];

    // Update fields if provided
    if (name) product.name = name;

    if (category) {
      let categoryId;
      try {
        categoryId = new mongoose.Types.ObjectId(category);
      } catch (error) {
        resHandler.setError(400, 'Format d\'ID de catégorie invalide');
        return resHandler.send(res);
      }
      const categoryExists = await Category.exists({ _id: categoryId });
      if (!categoryExists) {
        resHandler.setError(400, 'Catégorie invalide');
        return resHandler.send(res);
      }
      product.category = categoryId;
    }

    if (subCategory) {
      let subCategoryId;
      try {
        subCategoryId = new mongoose.Types.ObjectId(subCategory);
      } catch (error) {
        resHandler.setError(400, 'Format d\'ID de sous-catégorie invalide');
        return resHandler.send(res);
      }
      const subCategoryDoc = await SubCategory.findOne({ 
        _id: subCategoryId, 
        category: product.category || category
      });
      if (!subCategoryDoc) {
        resHandler.setError(400, 'Sous-catégorie invalide ou ne correspond pas à la catégorie');
        return resHandler.send(res);
      }
      product.subCategory = subCategoryId;
    }

    if (price) {
      if (typeof price !== 'number' || price < 0) {
        resHandler.setError(400, 'Le prix doit être un nombre non négatif');
        return resHandler.send(res);
      }
      product.price = price;
    }

    let newStocks = [];
    if (stocks) {
      if (!Array.isArray(stocks) || stocks.length === 0) {
        resHandler.setError(400, 'Stocks doivent être un tableau non vide');
        return resHandler.send(res);
      }
      // Validate each stock entry
      for (const stock of stocks) {
        if (!stock.color || typeof stock.color !== 'string') {
          resHandler.setError(400, 'Couleur de stock invalide ou manquante');
          return resHandler.send(res);
        }
        if (!stock.size || typeof stock.size !== 'string') {
          resHandler.setError(400, 'Taille de stock invalide ou manquante');
          return resHandler.send(res);
        }
        if (stock.quantity == null || typeof stock.quantity !== 'number' || stock.quantity < 0) {
          resHandler.setError(400, 'Quantité de stock invalide ou négative');
          return resHandler.send(res);
        }
      }
      // Map and ensure unique stocks by color and size
      const stockSet = new Set();
      for (const stock of stocks) {
        const key = `${stock.color}-${stock.size}`;
        if (!stockSet.has(key)) {
          stockSet.add(key);
          newStocks.push({
            color: stock.color,
            size: stock.size,
            quantity: stock.quantity
          });
        }
      }
    }

    // Stock history update: Track additions, updates, and removals
    if (stocks) {
  console.log('Request body stocks:', stocks);
  console.log('Original stocks:', originalStocks);

  // Log additions and updates
  for (const newStock of newStocks) {
    console.log('Processing new stock:', newStock);
    const oldStock = originalStocks.find(s => 
      s.color.trim().toLowerCase() === newStock.color.trim().toLowerCase() && 
      s.size.trim().toLowerCase() === newStock.size.trim().toLowerCase()
    );
    if (oldStock) {
      if (oldStock.quantity !== newStock.quantity) {
        console.log(`Updating stock: color=${newStock.color}, size=${newStock.size}, oldQty=${oldStock.quantity}, newQty=${newStock.quantity}`);
        const history = await StockHistory.create({
          product: product._id,
          user: req.user._id,
          color: newStock.color,
          size: newStock.size,
          action: 'update',
          quantityChange: newStock.quantity - oldStock.quantity,
          previousQuantity: oldStock.quantity,
          newQuantity: newStock.quantity
        });
        console.log('Stock history updated:', history);
      } else {
        console.log(`No quantity change for color=${newStock.color}, size=${newStock.size}`);
      }
    } else {
      console.log(`Adding new stock: color=${newStock.color}, size=${newStock.size}, qty=${newStock.quantity}`);
      const history = await StockHistory.create({
        product: product._id,
        user: req.user._id,
        color: newStock.color,
        size: newStock.size,
        action: 'add',
        quantityChange: newStock.quantity,
        previousQuantity: 0,
        newQuantity: newStock.quantity
      });
      console.log('Stock history added:', history);
    }
  }

  // Log removals (stocks in original but not in new)
  for (const oldStock of originalStocks) {
    const newStock = newStocks.find(s => 
      s.color.trim().toLowerCase() === oldStock.color.trim().toLowerCase() && 
      s.size.trim().toLowerCase() === oldStock.size.trim().toLowerCase()
    );
    if (!newStock) {
      console.log(`Removing stock: color=${oldStock.color}, size=${oldStock.size}, qty=${oldStock.quantity}`);
      const history = await StockHistory.create({
        product: product._id,
        user: req.user._id,
        color: oldStock.color,
        size: oldStock.size,
        action: 'remove',
        quantityChange: -oldStock.quantity,
        previousQuantity: oldStock.quantity,
        newQuantity: 0
      });
      console.log('Stock history removed:', history);
    }
  }

  // Apply new stocks to product
  product.stocks = newStocks;
}

    if (description) product.description = description;
    product.updatedAt = Date.now(); // Update the timestamp

    // Save product to apply updates and trigger schema validation
    await product.save();

    resHandler.setSuccess(200, 'Produit mis à jour avec succès', product);
    return resHandler.send(res);
  } catch (error) {
    console.error("Error updating product:", error);
    resHandler.setError(500, 'Erreur lors de la mise à jour du produit');
    return resHandler.send(res);
  }
};

const getProducts = async (req, res) => {
  // #swagger.tags = ['Products']
  const resHandler = new ResHandler();
  const { name, category, subCategory, color, stockSize, quantity } = req.query;
  const { page, size, skip, limit, sort } = paginate(req.query.page, req.query.limit, req.query.order, req.query.sortBy);

  const filter = {};
  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }
  if (category) {
    filter.category = category;
  }
  if (subCategory) {
    filter.subCategory = subCategory;
  }
  if (color || stockSize || quantity) {
    filter.stocks = {
      $elemMatch: {
        ...(color && { color }),
        ...(stockSize && { size: stockSize }),
        ...(quantity && { quantity: quantity })
      }
    };
  }

  try {
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('category', 'name')
        .populate('subCategory', 'name'),
      Product.countDocuments(filter), // Use the same filter for count
    ]);

    // Structure the response to match frontend expectations
    const responseData = {
      products,
      page,
      size,
      total,
      totalPages: Math.ceil(total / limit)
    };

    resHandler.setSuccess(200, 'Produits récupérés avec succès', responseData);
    return resHandler.send(res);
  } catch (error) {
    console.error('Error fetching products:', error);
    resHandler.setError(500, 'Erreur lors de la récupération des produits');
    return resHandler.send(res);
  }
}

const getProductStockHistory = async (req, res) => {
  // #swagger.tags = ['Products']
  const resHandler = new ResHandler();
  const { id } = req.params;
  const { page, size, skip, limit, sort } = paginate(req.query.page, req.query.limit, req.query.order, req.query.sortBy);
  const { startDate, endDate, action } = req.query;

  const filter = {}
  if (!id) {
    resHandler.setError(400, 'ID du produit requis');
    return resHandler.send(res);
  }
  filter.product = id;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.createdAt.$lte = new Date(endDate);
    }
  }
  if (action) {
    filter.action = action;
  }
  try {
    const [history, total] = await Promise.all([
      StockHistory.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      StockHistory.countDocuments({ product: id }),
    ]);

    resHandler.setSuccess(200, 'Historique du stock récupéré avec succès', { page, size, total, totalPages: Math.ceil(total / limit), history });
    return resHandler.send(res);
  } catch (error) {
    resHandler.setError(500, 'Erreur lors de la récupération de l\'historique du stock');
    return resHandler.send(res);
  }
};

const getUserStockHistory = async (req, res) => {
  // #swagger.tags = ['Products']
  const resHandler = new ResHandler();
  const { userId } = req.params;
  const { page, size, skip, limit, sort } = paginate(req.query.page, req.query.limit, req.query.order, req.query.sortBy);

  try {
    const [history, total] = await Promise.all([
      StockHistory.find({ user: userId })
        .sort(sort)
        .skip(skip)
        .limit(limit),
      StockHistory.countDocuments({ user: userId }),
    ]);

    resHandler.setSuccess(200, 'Historique du stock de l\'utilisateur récupéré avec succès', { page, size, total, totalPages: Math.ceil(total / limit), history });
    return resHandler.send(res);
  } catch (error) {
    resHandler.setError(500, 'Erreur lors de la récupération de l\'historique du stock de l\'utilisateur');
    return resHandler.send(res);
  }
};

const getAllStockHistory = async (req, res) => {
  // #swagger.tags = ['Products']
  const resHandler = new ResHandler();
  const { page, pageSize, skip, limit, sort } = paginate(req.query.page, req.query.limit, req.query.order, req.query.sortBy);
  const { product, user, color, size, startDate, endDate, action } = req.query;
  const filter = {};
  if (product) {
    filter.product = product;
  }
  if (user) {
    filter.user = user;
  }
  if (color) {
    filter.color = color;
  }
  if (size) {
    filter.size = size;
  }
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.createdAt.$lte = new Date(endDate);
    }
  }
  if (action) {
    filter.action = action;
  }
  try {
    const [history, total] = await Promise.all([
      StockHistory.find(filter)
        .populate('product', 'name')
        .populate('user', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      StockHistory.countDocuments(),
    ]);

    resHandler.setSuccess(200, 'Historique du stock récupéré avec succès', { page, pageSize, total, totalPages: Math.ceil(total / limit), history });
    return resHandler.send(res);
  } catch (error) {
    resHandler.setError(500, 'Erreur lors de la récupération de l\'historique du stock');
    return resHandler.send(res);
  }
};

module.exports = {
  createProduct,
  updateProductStock,
  updateProduct,
  getProducts,
  getProductStockHistory,
  getUserStockHistory,
  getAllStockHistory,
};
