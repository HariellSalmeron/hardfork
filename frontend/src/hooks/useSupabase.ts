import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { PostgrestError } from '@supabase/supabase-js'

export interface UseQueryOptions {
  enabled?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: PostgrestError) => void
}

export interface UseMutationOptions {
  onSuccess?: (data: any) => void
  onError?: (error: PostgrestError) => void
}

/**
 * Hook to fetch data from a Supabase table
 * @example
 * const { data, loading, error } = useQuery('profiles', { enabled: !!userId })
 */
export function useQuery(
  table: string,
  options: UseQueryOptions = {}
) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<PostgrestError | null>(null)

  const refetch = useCallback(async () => {
    if (options.enabled === false) return
    
    try {
      setLoading(true)
      const { data, error } = await supabase.from(table).select()
      
      if (error) {
        setError(error)
        options.onError?.(error)
      } else {
        setData(data)
        options.onSuccess?.(data)
      }
    } catch (err) {
      const postgrestError = err as PostgrestError
      setError(postgrestError)
      options.onError?.(postgrestError)
    } finally {
      setLoading(false)
    }
  }, [table, options, options.onError, options.onSuccess])

  return { data, loading, error, refetch }
}

/**
 * Hook to insert data into a Supabase table
 * @example
 * const { mutate, loading } = useMutation('profiles', { onSuccess: () => alert('Created!') })
 * mutate({ username: 'john', full_name: 'John Doe' })
 */
export function useMutation(
  table: string,
  options: UseMutationOptions = {}
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<PostgrestError | null>(null)

  const mutate = useCallback(async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: result, error: err } = await supabase
        .from(table)
        .insert([data])
        .select()

      if (err) {
        setError(err)
        options.onError?.(err)
      } else {
        options.onSuccess?.(result)
      }
    } catch (err) {
      const postgrestError = err as PostgrestError
      setError(postgrestError)
      options.onError?.(postgrestError)
    } finally {
      setLoading(false)
    }
  }, [table, options])

  return { mutate, loading, error }
}

/**
 * Hook to update data in a Supabase table
 * @example
 * const { mutate, loading } = useUpdate('profiles', userId)
 * mutate({ full_name: 'Jane Doe' })
 */
export function useUpdate(
  table: string,
  id: string,
  options: UseMutationOptions = {}
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<PostgrestError | null>(null)

  const mutate = useCallback(async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: result, error: err } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()

      if (err) {
        setError(err)
        options.onError?.(err)
      } else {
        options.onSuccess?.(result)
      }
    } catch (err) {
      const postgrestError = err as PostgrestError
      setError(postgrestError)
      options.onError?.(postgrestError)
    } finally {
      setLoading(false)
    }
  }, [table, id, options])

  return { mutate, loading, error }
}

/**
 * Hook to delete data from a Supabase table
 * @example
 * const { mutate, loading } = useDelete('profiles', userId)
 * mutate()
 */
export function useDelete(
  table: string,
  id: string,
  options: UseMutationOptions = {}
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<PostgrestError | null>(null)

  const mutate = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { error: err } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (err) {
        setError(err)
        options.onError?.(err)
      } else {
        options.onSuccess?.({})
      }
    } catch (err) {
      const postgrestError = err as PostgrestError
      setError(postgrestError)
      options.onError?.(postgrestError)
    } finally {
      setLoading(false)
    }
  }, [table, id, options])

  return { mutate, loading, error }
}
