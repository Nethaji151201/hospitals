import axios, { type AxiosRequestConfig } from 'axios';

// Base URL from Vite environment variable (Vite uses import.meta.env instead of process.env)
// Add VITE_BACKEND_URL=http://your-api.com to your .env file.
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8080';

// Create a configured axios instance
export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Omit withCredentials to avoid CORS failure when backend has Access-Control-Allow-Origin: *
});

/**
 * Generic axios wrapper mimicking your fetch wrapper.
 *
 * Usage:
 *   apiFetch("/users")
 *   apiFetch("/login", { method: "POST", data: { ... } })   // Note: Axios uses 'data', not 'body'
 */
export async function apiFetch(endpoint: string, options: AxiosRequestConfig = {}) {
    try {
        const response = await apiClient({
            url: endpoint,
            ...options,
        });

        // Axios automatically parses JSON responses
        return response.data;
    } catch (error: any) {
        let errorMessage = 'API Error';

        if (error.response) {
            // The server responded with a status code outside 2xx
            errorMessage = error.response.data?.message || errorMessage;
        } else if (error.request) {
            // Request made but no response received
            errorMessage = 'No response from server';
        } else {
            // Something happened in setting up the request
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
}
