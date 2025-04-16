// frontend/src/config/api.config.js
export const API_CONFIG = {
    development: {
        baseURL: 'http://localhost:8000'
    },
    production: {
        baseURL: 'http://localhost:8080'  // Change this for production
    }
};

// frontend/src/config/clickhouse.config.js
export const CLICKHOUSE_CONFIG = {
    development: {
        default: {
            host: "localhost",
            port: 9000,
            database: "default",
            user: "default",
            password: ""  // Replace with your actual token
        }
    },
    production: {
        default: {
            host: "your.clickhouse.server.com",
            port: 9440,  // or 8443 for HTTPS
            database: "your_database",
            user: "your_username",
            jwt_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"  // Replace with your actual token
        }
    }
};