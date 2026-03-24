// função para tratar a resposta de uma promise de requisição à API

'use client'

import type { ApiResponse } from '@/types/api/api.response.types'
import type { DataType } from '@/types/api/common.types'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function useApiResponse<T extends DataType>(
	fn: () => Promise<ApiResponse<T>>
): T | null {
	const [data, setData] = useState<T | null>(null)

	useEffect(() => {
		fn().then((res) => {
			if ("error" in res) toast.error(res.error.message)
			if ("errors" in res) res.errors.forEach((e) => toast.error(e.message))
			if ("data" in res) setData(res.data)
		})
	}, [fn])

	return data
}