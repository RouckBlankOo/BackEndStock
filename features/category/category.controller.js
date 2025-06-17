const { Category, SubCategory } = require("../../database");
const { paginate } = require("../../helpers/paginate.helper");
const ResHandler = require("../../helpers/res.helper");

const createCategory = async (req, res) => {
    // #swagger.tags = ['Categories']
    // #swagger.description = 'Créer une nouvelle catégorie'

    const resHandler = new ResHandler();
    try {
        const { name } = req.body;
        if (!name) {
            resHandler.setError(400, 'Le nom de la catégorie est requis');
            return resHandler.send(res);
        }

        const existing = await Category.findOne({ name });
        if (existing) {
            resHandler.setError(400, 'La catégorie existe déjà');
            return resHandler.send(res);
        }

        const category = await Category.create({ name });
        resHandler.setSuccess(201, 'Catégorie créée avec succès', { id: category._id, name: category.name });
        return resHandler.send(res);
    } catch (error) {
        resHandler.setError(500, 'Erreur lors de la création de la catégorie');
        return resHandler.send(res);
    }
};

const updateCategory = async (req, res) => {
    // #swagger.tags = ['Categories']

    const resHandler = new ResHandler();
    const { id } = req.params;
    const { name } = req.body;

    try {
        const category = await Category.findById(id);
        if (!category) {
            resHandler.setError(404, 'Catégorie non trouvée');
            return resHandler.send(res);
        }

        category.name = name || category.name;
        await category.save();

        resHandler.setSuccess(200, 'Catégorie mise à jour', { id: category._id, name: category.name });
        return resHandler.send(res);
    } catch (error) {
        resHandler.setError(500, 'Erreur lors de la mise à jour de la catégorie');
        return resHandler.send(res);
    }
};

const deleteCategory = async (req, res) => {
    // #swagger.tags = ['Categories']

    const resHandler = new ResHandler();
    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        if (!category) {
            resHandler.setError(404, 'Catégorie non trouvée');
            return resHandler.send(res);
        }

        const hasSubCategories = await SubCategory.exists({ category: id });
        if (hasSubCategories) {
            resHandler.setError(400, 'La catégorie contient des sous-catégories et ne peut pas être supprimée');
            return resHandler.send(res);
        }

        await Category.deleteOne({
            _id: id
        });
        resHandler.setSuccess(200, 'Catégorie supprimée avec succès');
        return resHandler.send(res);
    } catch (error) {
        console.log('category.controller.js - Error deleting category:', error);

        resHandler.setError(500, 'Erreur lors de la suppression de la catégorie');
        return resHandler.send(res);
    }
};

// const getCategories = async (req, res) => {
//   const resHandler = new ResHandler();
//   const { page, size, skip, limit, sort } = paginate(req.query.page, req.query.limit, req.query.order, req.query.sortBy);

//   try {
//     const [categories, total] = await Promise.all([
//       Category.find().sort(sort).skip(skip).limit(limit),
//       Category.countDocuments(),
//     ]);

//     resHandler.setSuccess(200, 'Catégories récupérées avec succès', { page, size, total, totalPages: Math.ceil(total / limit), categories });
//     return resHandler.send(res);
//   } catch (error) {
//     resHandler.setError(500, 'Erreur lors de la récupération des catégories');
//     return resHandler.send(res);
//   }
// };


const getCategories = async (req, res) => {
    // #swagger.tags = ['Categories']

    const resHandler = new ResHandler();
    const { page, size, skip, limit, sort } = paginate(req.query.page, req.query.limit, req.query.order, req.query.sortBy);

    try {
        const [categories, total] = await Promise.all([
            Category.find({
                name: { $regex: req.query.name || '', $options: 'i' }
            })
                .populate({
                    path: 'subCategories'
                })
                .sort(sort)
                .skip(skip)
                .limit(limit),
            Category.countDocuments(),
        ]);

        resHandler.setSuccess(200, 'Catégories récupérées avec succès', {
            page,
            size,
            total,
            totalPages: Math.ceil(total / limit),
            categories: categories
        });
        return resHandler.send(res);
    } catch (error) {
        console.log(error);

        resHandler.setError(500, 'Erreur lors de la récupération des catégories');
        return resHandler.send(res);
    }
};

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories,
};
