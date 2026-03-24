// usar em client side

'use server'

import type { DataType } from '@/types/api/common.types'
import { apiRequest } from '@/lib/api/request'
import type { ApiActionParams, ApiActionReturn } from '@/types/api/action'

export async function apiAction<
	T extends DataType,
	D extends DataType = never
>({
	successMessage,
	...apiProps
}: ApiActionParams<D>): Promise<ApiActionReturn<T>> {
	const actionReturn: ApiActionReturn<T> = {
		data: null,
		message: successMessage
	}

	const apiRes = await apiRequest<T, D>(apiProps)

	if ('error' in apiRes) actionReturn.message = apiRes.error.message
	if ('errors' in apiRes)
		// biome-ignore lint/style/noNonNullAssertion: Just ignore Biome here
		actionReturn.message = apiRes.errors[0]!.message

	if ('data' in apiRes) {
		actionReturn.data = apiRes.data
	}
	return actionReturn
}
