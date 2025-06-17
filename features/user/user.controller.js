
const { User, LoginHistory } = require("../../database");
const { createToken } = require("../../helpers/jwt.helper");
const { paginate } = require("../../helpers/paginate.helper");
const ResHandler = require("../../helpers/res.helper");

/**
 * POST /login
 * Body: { username, password, deviceName }
 */
const login = async (req, res) => {
  // #swagger.tags = ['Users']

  const resHandler = new ResHandler();

  try {

    console.log('login body', req.body);

    const { username, password, deviceName } = req.body;

    if (!username || !password) {
      resHandler.setError(400, 'Le nom d\'utilisateur, le mot de passe  sont requis');
      return resHandler.send(res);
    }

    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      resHandler.setError(401, 'Identifiants invalides');
      return resHandler.send(res);
    }

    await LoginHistory.create({
      user: user._id,
      deviceName: !deviceName ? 'From Web' : deviceName,
    });

    const token = createToken(user._id);


    resHandler.setSuccess(200, 'Connexion réussie', {
      id: user._id,
      name: user.name,
      username: user.username,
      role: user.role,
      token,
    });
    return resHandler.send(res);
  } catch (error) {
    console.log('error in login', error);

    resHandler.setError(500, 'Erreur serveur lors de la connexion');
    return resHandler.send(res);
  }
};

/**
 * POST /users
 * Body: { name, username, password, role }
 */
const createUser = async (req, res) => {
    // #swagger.tags = ['Users']

  const resHandler = new ResHandler();

  try {
    const { name, username, password, role } = req.body;

    if (!name || !username || !password || !role) {
      resHandler.setError(400, 'Le nom, le nom d\'utilisateur, le mot de passe et le rôle sont requis');
      return resHandler.send(res);
    }

    const existing = await User.findOne({ username });
    if (existing) {
      resHandler.setError(400, 'Le nom d\'utilisateur existe déjà');
      return resHandler.send(res);
    }

    const user = await User.create({ name, username, password, role });
    if (!user) {
      resHandler.setError(500, 'Erreur lors de la création de l\'utilisateur');
      return resHandler.send(res);
    }

    resHandler.setSuccess(201, 'Utilisateur créé avec succès', {
      id: user._id,
      name: user.name,
      username: user.username,
      role: user.role,
    });
    return resHandler.send(res);
  } catch (error) {
    resHandler.setError(500, 'Erreur lors de la création de l\'utilisateur');
    return resHandler.send(res);
  }
};

/**
 * PUT /users/:id
 * Body: { name?, password?, role? }
 */
const updateUser = async (req, res) => {
    // #swagger.tags = ['Users']

  const resHandler = new ResHandler();
  const { id } = req.params;
  const { name, password, role } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      resHandler.setError(404, 'Utilisateur non trouvé');
      return resHandler.send(res);
    }

    if (name) user.name = name;
    if (password) user.password = password;
    if (role) user.role = role;

    await user.save();

    resHandler.setSuccess(200, 'Utilisateur mis à jour', {
      id: user._id,
      name: user.name,
      username: user.username,
      role: user.role,
    });
    return resHandler.send(res);
  } catch (error) {
    resHandler.setError(500, 'Erreur lors de la mise à jour de l\'utilisateur');
    return resHandler.send(res);
  }
};

/**
 * GET /users/:id/login-history
 */
const getLoginHistory = async (req, res) => {
  // #swagger.tags = ['Users']

  const resHandler = new ResHandler();
  const { id } = req.params;

  try {
    const { page, size, skip, limit, sort } = paginate(
      req.query.page,
      req.query.limit,
      req.query.order,
      req.query.sortBy
    );

    const [history, total] = await Promise.all([
      LoginHistory.find({ user: id })
        .populate('user', 'name username role') // populate user with selected fields
        .sort(sort)
        .skip(skip)
        .limit(limit),
      LoginHistory.countDocuments({ user: id }),
    ]);

    resHandler.setSuccess(200, 'Historique de connexion récupéré avec succès', {
      userId: id,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      history,
    });
    return resHandler.send(res);
  } catch (error) {
    resHandler.setError(500, 'Erreur lors de la récupération de l\'historique de connexion');
    return resHandler.send(res);
  }
};


const getUserSession = async (req, res) => {
  // #swagger.tags = ['Users']

  const resHandler = new ResHandler();
  const user = req.user;

  try {
    if (!user) {
      resHandler.setError(401, 'Utilisateur non authentifié');
      return resHandler.send(res);
    }

    resHandler.setSuccess(200, 'Session utilisateur récupérée', {
      id: user._id,
      name: user.name,
      username: user.username,
      role: user.role,
    });
    return resHandler.send(res);
  } catch (error) {
    resHandler.setError(500, 'Erreur lors de la récupération de la session utilisateur');
    return resHandler.send(res);
  }
}

const getAllUsers = async (req, res) => {
  // #swagger.tags = ['Users']

  const resHandler = new ResHandler();

  try {
    const { page, size, skip, limit, sort } = paginate(
      req.query.page,
      req.query.limit,
      req.query.order,
      req.query.sortBy
    );

    const [users, total] = await Promise.all([
      User.find()
        .sort(sort)
        .skip(skip)
        .limit(limit),
      User.countDocuments(),
    ]);

    resHandler.setSuccess(200, 'Utilisateurs récupérés avec succès', {
      page,
      size,
      total,
      totalPages: Math.ceil(total / limit),
      users,
    });
    return resHandler.send(res);
  } catch (error) {
    resHandler.setError(500, 'Erreur lors de la récupération des utilisateurs');
    return resHandler.send(res);
  }
};

module.exports = {
  login,
  createUser,
  updateUser,
  getAllUsers,
  getLoginHistory,
  getUserSession
};
