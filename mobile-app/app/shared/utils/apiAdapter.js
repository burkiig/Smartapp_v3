import NetInfo from '@react-native-community/netinfo';
import apiClient from '../../../src/api/apiClient';

/**
 * API Adapter for React Native
 * Wraps apiClient (Axios) with network detection and error handling
 */
class APIAdapter {
    constructor() {
        this.client = apiClient;
    }

    /**
     * Check network connectivity
     */
    async checkNetwork() {
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
            throw {
                message: 'No internet connection',
                code: 'NO_INTERNET',
                isNetworkError: true
            };
        }
    }

    /**
     * Make HTTP request with network check
     */
    async request(method, endpoint, data = null, options = {}) {
        // Network check
        await this.checkNetwork();

        try {
            let response;
            
            switch (method.toUpperCase()) {
                case 'GET':
                    response = await this.client.get(endpoint, options);
                    break;
                case 'POST':
                    response = await this.client.post(endpoint, data, options);
                    break;
                case 'PUT':
                    response = await this.client.put(endpoint, data, options);
                    break;
                case 'DELETE':
                    response = await this.client.delete(endpoint, options);
                    break;
                case 'PATCH':
                    response = await this.client.patch(endpoint, data, options);
                    break;
                default:
                    throw new Error(`Unsupported method: ${method}`);
            }

            return response.data;
        } catch (error) {
            if (error.isNetworkError) throw error;

            console.error('[APIAdapter] Error:', error);

            throw {
                message: error.response?.data?.message || error.message || 'Request failed',
                status: error.response?.status || 500,
                isNetworkError: false,
                originalError: error
            };
        }
    }

    /**
     * Convenience methods
     */
    get(endpoint, options = {}) {
        return this.request('GET', endpoint, null, options);
    }

    post(endpoint, data, options = {}) {
        return this.request('POST', endpoint, data, options);
    }

    put(endpoint, data, options = {}) {
        return this.request('PUT', endpoint, data, options);
    }

    delete(endpoint, options = {}) {
        return this.request('DELETE', endpoint, null, options);
    }

    patch(endpoint, data, options = {}) {
        return this.request('PATCH', endpoint, data, options);
    }
}

// Export singleton instance
export default new APIAdapter();
