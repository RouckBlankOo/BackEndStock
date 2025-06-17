const dotenv = require('dotenv');
const express = require('express');
// const morgan = require('morgan');
const cors = require('cors');
const routes = require("./routes");
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

dotenv.config();

const { getEnvConfig, validateEnv } = require('./core/env.config');
const { connectToDatabase } = require('./database');
const { createDefaultAdmin } = require('./helpers/admin.helper');

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(express.json({
    limit: '50mb',
}));
app.use(express.urlencoded({
    limit: '50mb',
    extended: true,
}));
// app.use(morgan('dev'));

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(routes);



const startServer = async () => {
    const envCheck = validateEnv();
    if (!envCheck) {
        console.error('❌ Environment variables validation failed');
        process.exit(1);
    }

    const PORT = getEnvConfig().port
    const MONGO_URI = getEnvConfig().mongoUri;


    await connectToDatabase(MONGO_URI);
    await createDefaultAdmin();

    app.listen(PORT, () => {
        console.log(`🚀 Server listening on http://127.0.0.1:${PORT}`);
    });
};

startServer();
