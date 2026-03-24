import type { DataType } from '@/types/api/common.types'
import type { ApiRequestParams } from '@/types/api/api'

export type ApiActionParams<T extends DataType> = ApiRequestParams<T> & {
	successMessage: string
}

export type ApiActionReturn<T extends DataType> = {
	message: string
	data: T | null
	headers?: Record<string, string>
}
