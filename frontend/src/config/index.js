// frontend/src/config/index.js
import { API_CONFIG } from './api.config';
import { CLICKHOUSE_CONFIG } from './clickhouse.config';

const environment = process.env.NODE_ENV || 'development';

export const getConfig = () => ({
    api: API_CONFIG[environment],
    clickhouse: CLICKHOUSE_CONFIG[environment]
});

export const getDefaultClickHouseConfig = () => {
    return CLICKHOUSE_CONFIG[environment].default;
};