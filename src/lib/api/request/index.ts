// função para fazer uma promise de requisição à API
import type { ApiResponse } from '@/types/api/api.response.types'
import type { ApiRequestParams, ApiRequestReturn } from '@/types/api/api'
import type { DataType } from '@/types/api/common.types'
import type { AxiosResponse } from 'axios'
import api from '@/lib/api/config/axios'
import { asyncApiTryCatch } from '@/lib/api/error'

export async function apiRequest<
	T extends DataType,
	D extends DataType = never
>({ method, url, data }: ApiRequestParams<D>): ApiRequestReturn<T> {
	return asyncApiTryCatch(
		api[method]<ApiResponse<T>, AxiosResponse<ApiResponse<T>>, D>(url, data)
	)
}
