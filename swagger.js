// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Your API Title',
        description: 'Description of your API',
        version: '1.0.0'
    },
    host: 'localhost:3000',
    basePath: '/',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {  // Changed from components to securityDefinitions
        BearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'JWT Authorization header using the Bearer scheme. Example: "Bearer {token}"'
        }
    },
    security: [{
        BearerAuth: []
    }]
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./server.js']; // Adjust this path to match your route files

swaggerAutogen(outputFile, endpointsFiles, doc);
