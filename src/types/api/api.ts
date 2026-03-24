
import type { ApiResponse } from '../api/api.response.types'
import type { DataType } from './common.types'

export type API_METHODS = 'get' | 'post' | 'put' | 'patch' | 'delete'

export type ApiRequestParams<T extends DataType> = {
	method: API_METHODS
	url: string
	data?: T
}

export type ApiRequestReturn<T extends DataType> = Promise<ApiResponse<T>>