// frontend/src/services/api.js
import axios from 'axios';
import { getConfig } from '../config';

const config = getConfig();
const api = axios.create({
    baseURL: config.api.baseURL
});

export const connectToClickHouse = async (clickhouseConfig) => {
    try {
        const response = await api.post('/connect/clickhouse', clickhouseConfig);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};