require('dotenv').config();


const VARIABLES = [
    'PORT',
    'MONGO_URI',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD',
    'JWT_SECRET',
    'JWT_EXPIRATION',
    'IS_DEV',
]

function getEnvVariable(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`❌ Missing required environment variable: ${name}`);
    }
    return value; 
}

function getEnvConfig() {
    return {
        port: getEnvVariable('PORT'),
        mongoUri: getEnvVariable('MONGO_URI'),
        admin_username: getEnvVariable('ADMIN_USERNAME'),
        admin_password: getEnvVariable('ADMIN_PASSWORD'),
        jwt_secret: getEnvVariable('JWT_SECRET'),
        jwt_expiration: getEnvVariable('JWT_EXPIRATION'),
        is_dev: getEnvVariable('IS_DEV') === 'true',
    };
}

function validateEnv() {
    const missing = VARIABLES.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(
            `❌ Missing required environment variables: ${missing.join(', ')}`
        );
    } else {

        console.log('✅ All required environment variables are set');
        return true;
    }
}

module.exports = { getEnvConfig, validateEnv };
