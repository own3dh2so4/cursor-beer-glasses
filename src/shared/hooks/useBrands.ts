import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { loadAllBrands, loadBrandById } from '@/shared/utils/dataLoader'
import type { Brand } from '@/shared/types'

export const useBrands = (): UseQueryResult<Brand[], Error> => {
    return useQuery({
        queryKey: ['brands'],
        queryFn: loadAllBrands,
        retry: 1,
        retryDelay: 1000,
    })
}

export const useBrand = (id: string | undefined): UseQueryResult<Brand | undefined, Error> => {
    return useQuery({
        queryKey: ['brand', id],
        queryFn: () => {
            if (!id) throw new Error('Brand ID is required')
            return loadBrandById(id)
        },
        enabled: !!id,
    })
}
