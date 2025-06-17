const { Product, StockHistory, SubCategory, Category } = require("../../database");
const ResHandler = require("../../helpers/res.helper");
const { paginate } = require('../../helpers/paginate.helper');
const { default: mongoose } = require("mongoose");



// const getTotalProducts = async (req, res) => {
//   // #swagger.tags = ['Stats']
//   const resHandler = new ResHandler();
//   try {
//     const totalProducts = await Product.countDocuments();
//     resHandler.setSuccess(200, 'Total des produits récupéré avec succès', { total: totalProducts });
//     return resHandler.send(res);
//   } catch (error) {
//     console.error("Error getting total products:", error);
//     resHandler.setError(500, 'Erreur lors de la récupération du total des produits');
//     return resHandler.send(res);
//   }
// };

// const getTotalStocks = async (req, res) => {
//   // #swagger.tags = ['Stats']
//   const resHandler = new ResHandler();
//   try {
//     const totalStocks = await Product.aggregate([
//       {
//         $unwind: "$stocks"
//       },
//       {
//         $group: {
//           _id: null,
//           totalQuantity: { $sum: "$stocks.quantity" }
//         }
//       }
//     ]);

//     const totalStock = totalStocks.length > 0 ? totalStocks[0].totalQuantity : 0;
//     resHandler.setSuccess(200, 'Total des stocks récupéré avec succès', { total: totalStock });
//     return resHandler.send(res);
//   }
//   catch (error) {
//     console.error("Error getting total stocks:", error);
//     resHandler.setError(500, 'Erreur lors de la récupération du total des stocks');
//     return resHandler.send(res);
//   }
// };
// const getTotalPricesOfProducts = async (req, res) => {
//   // #swagger.tags = ['Stats']
//   const resHandler = new ResHandler();
//   try {
//     const totalPriceResult = await Product.aggregate([
//       {
//         $addFields: {
//           totalStock: { $sum: "$stocks.quantity" }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: { $multiply: ["$price", "$totalStock"] } }
//         }
//       }
//     ]);

//     const totalPrice = totalPriceResult.length > 0 ? totalPriceResult[0].total : 0;
//     resHandler.setSuccess(200, 'Total des prix des produits récupéré avec succès', { total: totalPrice });
//     return resHandler.send(res);
//   } catch (error) {
//     console.error("Error getting total prices of products:", error);
//     resHandler.setError(500, 'Erreur lors de la récupération du total des prix des produits');
//     return resHandler.send(res);
//   }
// };

// const inOut = async (req, res) => {
//   // #swagger.tags = ['Stats']
//     const resHandler = new ResHandler();

//   try {
//     const stats = await StockHistory.aggregate([
//       // Step 1: Join with the Product collection to get product prices
//       {
//         $lookup: {
//           from: 'products', // Must match the actual collection name (likely 'products' for Product model)
//           localField: 'product',
//           foreignField: '_id',
//           as: 'productInfo'
//         }
//       },
//       // Step 2: Unwind the productInfo array (each StockHistory entry links to one product)
//       {
//         $unwind: '$productInfo'
//       },
//       // Step 3: Group all records to compute totals
//       {
//         $group: {
//           _id: null, // Group all documents together
//           productsSelled: {
//             $sum: {
//               $cond: [
//                 { $eq: ['$action', 'sell'] }, // Only for 'sell' actions
//                 { $multiply: [-1, '$quantityChange'] }, // Convert negative quantityChange to positive units sold
//                 0 // Default value if condition is false
//               ]
//             }
//           },
//           productsReturned: {
//             $sum: {
//               $cond: [
//                 { $eq: ['$action', 'return'] }, // Only for 'return' actions
//                 '$quantityChange', // Positive quantityChange for returns
//                 0
//               ]
//             }
//           },
//           moneyEarned: {
//             $sum: {
//               $cond: [
//                 { $eq: ['$action', 'sell'] },
//                 { $multiply: [{ $multiply: [-1, '$quantityChange'] }, '$productInfo.price'] }, // Units sold × price
//                 0
//               ]
//             }
//           },
//           moneyReturned: {
//             $sum: {
//               $cond: [
//                 { $eq: ['$action', 'return'] },
//                 { $multiply: ['$quantityChange', '$productInfo.price'] }, // Units returned × price
//                 0
//               ]
//             }
//           }
//         }
//       }
//     ]);

//     // Step 4: Handle case where there are no records
//     const result = stats.length > 0 ? stats[0] : {
//       productsSelled: 0,
//       productsReturned: 0,
//       moneyEarned: 0,
//       moneyReturned: 0
//     };
//     resHandler.setSuccess(200, 'Statistiques de stock récupérées avec succès', result);
//     return resHandler.send(res);
//   } catch (error) {
//     console.error("Error getting stock statistics:", error);
//     resHandler.setError(500, 'Erreur lors de la récupération des statistiques de stock');
//     return resHandler.send(res);
//   }
// } 



// Fetches the total number of products, optionally filtered by date range
const getTotalProducts = async (req, res) => {
  // #swagger.tags = ['Stats']
  const resHandler = new ResHandler();
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    
    // Add date range filter if both startDate and endDate are provided
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const totalProducts = await Product.countDocuments(query);
    resHandler.setSuccess(200, 'Total des produits récupéré avec succès', { total: totalProducts });
    return resHandler.send(res);
  } catch (error) {
    console.error("Error getting total products:", error);
    resHandler.setError(500, 'Erreur lors de la récupération du total des produits');
    return resHandler.send(res);
  }
};

// Fetches the total number of stocks, optionally filtered by date range
const getTotalStocks = async (req, res) => {
  // #swagger.tags = ['Stats']
  const resHandler = new ResHandler();
  try {
    const { startDate, endDate } = req.query;
    const matchStage = {};
    
    // Add date range filter if both startDate and endDate are provided
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const totalStocks = await Product.aggregate([
      { $match: matchStage },
      {
        $unwind: "$stocks"
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$stocks.quantity" }
        }
      }
    ]);

    const totalStock = totalStocks.length > 0 ? totalStocks[0].totalQuantity : 0;
    resHandler.setSuccess(200, 'Total des stocks récupéré avec succès', { total: totalStock });
    return resHandler.send(res);
  } catch (error) {
    console.error("Error getting total stocks:", error);
    resHandler.setError(500, 'Erreur lors de la récupération du total des stocks');
    return resHandler.send(res);
  }
};

// Fetches the total prices of products, optionally filtered by date range
const getTotalPricesOfProducts = async (req, res) => {
  // #swagger.tags = ['Stats']
  const resHandler = new ResHandler();
  try {
    const { startDate, endDate } = req.query;
    const matchStage = {};
    
    // Add date range filter if both startDate and endDate are provided
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const totalPriceResult = await Product.aggregate([
      { $match: matchStage },
      {
        $addFields: {
          totalStock: { $sum: "$stocks.quantity" }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$price", "$totalStock"] } }
        }
      }
    ]);

    const totalPrice = totalPriceResult.length > 0 ? totalPriceResult[0].total : 0;
    resHandler.setSuccess(200, 'Total des prix des produits récupéré avec succès', { total: totalPrice });
    return resHandler.send(res);
  } catch (error) {
    console.error("Error getting total prices of products:", error);
    resHandler.setError(500, 'Erreur lors de la récupération du total des prix des produits');
    return resHandler.send(res);
  }
};

// Fetches stock statistics (in/out), optionally filtered by date range
const inOut = async (req, res) => {
  // #swagger.tags = ['Stats']
  const resHandler = new ResHandler();

  try {
    const { startDate, endDate } = req.query;
    const matchStage = {};
    
    // Add date range filter if both startDate and endDate are provided
    if (startDate && endDate) {
      matchStage.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await StockHistory.aggregate([
      // Step 1: Filter by date range if provided
      { $match: matchStage },
      // Step 2: Join with the Product collection to get product prices
      {
        $lookup: {
          from: 'products', // Must match the actual collection name (likely 'products' for Product model)
          localField: 'product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      // Step 3: Unwind the productInfo array (each StockHistory entry links to one product)
      {
        $unwind: '$productInfo'
      },
      // Step 4: Group all records to compute totals
      {
        $group: {
          _id: null, // Group all documents together
          productsSelled: {
            $sum: {
              $cond: [
                { $eq: ['$action', 'sell'] }, // Only for 'sell' actions
                { $multiply: [-1, '$quantityChange'] }, // Convert negative quantityChange to positive units sold
                0 // Default value if condition is false
              ]
            }
          },
          productsReturned: {
            $sum: {
              $cond: [
                { $eq: ['$action', 'return'] }, // Only for 'return' actions
                '$quantityChange', // Positive quantityChange for returns
                0
              ]
            }
          },
          moneyEarned: {
            $sum: {
              $cond: [
                { $eq: ['$action', 'sell'] },
                { $multiply: [{ $multiply: [-1, '$quantityChange'] }, '$productInfo.price'] }, // Units sold × price
                0
              ]
            }
          },
          moneyReturned: {
            $sum: {
              $cond: [
                { $eq: ['$action', 'return'] },
                { $multiply: ['$quantityChange', '$productInfo.price'] }, // Units returned × price
                0
              ]
            }
          }
        }
      }
    ]);

    // Step 5: Handle case where there are no records
    const result = stats.length > 0 ? stats[0] : {
      productsSelled: 0,
      productsReturned: 0,
      moneyEarned: 0,
      moneyReturned: 0
    };
    resHandler.setSuccess(200, 'Statistiques de stock récupérées avec succès', result);
    return resHandler.send(res);
  } catch (error) {
    console.error("Error getting stock statistics:", error);
    resHandler.setError(500, 'Erreur lors de la récupération des statistiques de stock');
    return resHandler.send(res);
  }
}

module.exports = {
  getTotalProducts,
  getTotalPricesOfProducts,
  getTotalStocks,
  inOut
};
