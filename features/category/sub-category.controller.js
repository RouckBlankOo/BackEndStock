const { SubCategory, Product, Category } = require("../../database");
const { paginate } = require("../../helpers/paginate.helper");
const ResHandler = require("../../helpers/res.helper");

const createSubCategory = async (req, res) => {
       // #swagger.tags = ['Categories']

  const resHandler = new ResHandler();
  const { category, name } = req.body;

  try {
    if (!category || !name) {
      resHandler.setError(400, 'La catégorie et le nom de la sous-catégorie sont requis');
      return resHandler.send(res);
    }
    const categoryExists = await Category.exists({ _id: category });
    if (!categoryExists) {
      resHandler.setError(400, 'La catégorie spécifiée n’existe pas');
      return resHandler.send(res);
    }
    const subCategory = await SubCategory.create({ category, name });
    
    await Category.findByIdAndUpdate(
        category,
        { $push: { subCategories: subCategory._id } },
        { new: true }
      );

    resHandler.setSuccess(201, 'Sous-catégorie créée avec succès', { id: subCategory._id, name: subCategory.name, category });
    return resHandler.send(res);
  } catch (error) {
    resHandler.setError(500, 'Erreur lors de la création de la sous-catégorie');
    return resHandler.send(res);
  }
};

const updateSubCategory = async (req, res) => {
       // #swagger.tags = ['Categories']

  const resHandler = new ResHandler();
  const { id } = req.params;
  const { name, category } = req.body;

  try {
    
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      resHandler.setError(404, 'Sous-catégorie non trouvée');
      return resHandler.send(res);
    }

    subCategory.name = name || subCategory.name;
    subCategory.category = category || subCategory.category;
    await subCategory.save();

    resHandler.setSuccess(200, 'Sous-catégorie mise à jour', { id: subCategory._id, name: subCategory.name, category: subCategory.category });
    return resHandler.send(res);
  } catch (error) {
    resHandler.setError(500, 'Erreur lors de la mise à jour de la sous-catégorie');
    return resHandler.send(res);
  }
};

const deleteSubCategory = async (req, res) => {
       // #swagger.tags = ['Categories']

  const resHandler = new ResHandler();
  const { id } = req.params;

  try {
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      resHandler.setError(404, 'Sous-catégorie non trouvée');
      return resHandler.send(res);
    }

    const hasProducts = await Product.exists({ subCategory: id });
    if (hasProducts) {
      resHandler.setError(400, 'La sous-catégorie contient des produits et ne peut pas être supprimée');
      return resHandler.send(res);
    }

    await subCategory.remove();
    resHandler.setSuccess(200, 'Sous-catégorie supprimée avec succès');
    return resHandler.send(res);
  } catch (error) {
    resHandler.setError(500, 'Erreur lors de la suppression de la sous-catégorie');
    return resHandler.send(res);
  }
};

const getSubCategories = async (req, res) => {
       // #swagger.tags = ['Categories']

  const resHandler = new ResHandler();
  const { page, size, skip, limit, sort } = paginate(req.query.page, req.query.limit, req.query.order, req.query.sortBy);

  try {
    const [subCategories, total] = await Promise.all([
      SubCategory.find({
        ...(req.query.category ? { category: req.query.category } : {}),
        ...(req.query.name ? { name: { $regex: req.query.name || '', $options: 'i' } } : {})
      })
      .populate('category', 'name')
      .sort(sort).skip(skip).limit(limit),
      SubCategory.countDocuments(),
    ]);

    resHandler.setSuccess(200, 'Sous-catégories récupérées avec succès', { page, size, total, totalPages: Math.ceil(total / limit), subCategories });
    return resHandler.send(res);
  } catch (error) {
    resHandler.setError(500, 'Erreur lors de la récupération des sous-catégories');
    return resHandler.send(res);
  }
};

module.exports = {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategories,
};
