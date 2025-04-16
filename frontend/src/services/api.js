// frontend/src/services/api.js
import axios from 'axios';
import { getConfig } from '../config';

const config = getConfig();
const api = axios.create({
    baseURL: config.api.baseURL
});

// export const connectToClickHouse = async (clickhouseConfig) => {
//     try {
//         const response = await api.post('/api/connect', clickhouseConfig);
//         return response.data;
//     } catch (error) {
//         console.error('Connection error:', error);
//         throw error.response?.data || error.message;
//     }
// };
export const connectToClickHouse = async (clickhouseConfig) => {
    try {
        // Add this console.log for debugging
        console.log('Making API request with config:', clickhouseConfig);
        
        const response = await api.post('/api/connect', clickhouseConfig);
        return response.data;
    } catch (error) {
        console.error('API error:', error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};