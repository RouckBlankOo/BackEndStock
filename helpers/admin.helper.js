const { getEnvConfig } = require("../core/env.config");
const { User } = require("../database");


async function createDefaultAdmin() {
    const username = getEnvConfig().admin_username;
    const password = getEnvConfig().admin_password;

    const existingAdmin = await User.findOne({ username });

    if (existingAdmin) {
        console.log('✅ Admin user already exists');
        return;
    }

    const admin = new User({
        name: 'Admin',
        username,
        password,
        role: 'admin',
    });

    await admin.save();
    console.log('✅ Default admin created');
}


async function restoreDefaultAdmin() {
    const username = getEnvConfig().admin_username;
    const password = getEnvConfig().admin_password;

    const existingAdmin = await User.findOne({ username });
    if (!existingAdmin) {
        await createDefaultAdmin();
        console.log('✅ Admin user created');
    }
    else {
        console.log('✅ Admin user already exists');
        existingAdmin.password = password;
        await existingAdmin.save();
    }
}

module.exports = { createDefaultAdmin, restoreDefaultAdmin };
