import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios'
import axiosRetry from 'axios-retry'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

const api = axios.create({
	baseURL: API_BASE_URL,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	if (!config.headers) {
		config.headers = new AxiosHeaders()
	}
	const data = config.data

	if (typeof FormData !== 'undefined' && data instanceof FormData) {
		config.headers.delete('Content-Type')
		return config
	}

	if (data !== undefined && !config.headers.has('Content-Type')) {
		config.headers.set('Content-Type', 'application/json')
	}

	return config
})

axiosRetry(api, {
	retries: 5,
	retryDelay: (retryCount) => {
		console.log(`Tentativa de conexão nº ${retryCount}...`)
		return retryCount * 1000
	},
	retryCondition: (error) => {
		return (
			axiosRetry.isNetworkOrIdempotentRequestError(error) ||
			error.code === 'ECONNREFUSED'
		)
	},
	shouldResetTimeout: true
})

export default api