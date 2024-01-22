require('dotenv').config();

const config = () => {
    return {
        PORT: process.env.PORT,
        YAML: './swagger/api.yaml',
        JWT_KEY: process.env.JWT_KEY,
    }
}

exports.config = config;