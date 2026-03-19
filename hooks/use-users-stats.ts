'use client'

import useSWR from 'swr'

export interface UserWithStats {
  user_identifier: string
  total_recordings: number
  avg_duration: number
  current_streak: number
  max_streak: number
  latest_sentiment: 'positive' | 'negative' | 'neutral'
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Error al cargar datos')
  }
  return res.json()
}

export function useUsersStats() {
  const { data, error, isLoading, mutate } = useSWR<{ users: UserWithStats[] }>(
    '/api/users/stats',
    fetcher
  )

  return {
    users: data?.users || [],
    isLoading,
    error,
    mutate
  }
}
