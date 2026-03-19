import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Obtener estadísticas de todos los usuarios usando la función SQL
    const { data: stats, error: statsError } = await supabase
      .rpc('get_all_users_stats')

    if (statsError) {
      console.error('Error fetching user stats:', statsError)
      return NextResponse.json(
        { error: 'Error al obtener estadísticas de usuarios' },
        { status: 500 }
      )
    }

    // Obtener el último sentimiento de cada usuario
    const { data: latestRecordings, error: recordingsError } = await supabase
      .from('recordings')
      .select('user_identifier, sentiment, created_at')
      .order('created_at', { ascending: false })

    if (recordingsError) {
      console.error('Error fetching recordings:', recordingsError)
      return NextResponse.json(
        { error: 'Error al obtener grabaciones' },
        { status: 500 }
      )
    }

    // Crear un mapa con el último sentimiento de cada usuario
    const latestSentimentMap = new Map<string, string>()
    for (const recording of latestRecordings) {
      if (!latestSentimentMap.has(recording.user_identifier)) {
        latestSentimentMap.set(recording.user_identifier, recording.sentiment || 'neutral')
      }
    }

    // Combinar estadísticas con el último sentimiento
    const usersWithSentiment = (stats || []).map((user: {
      user_identifier: string
      total_recordings: number
      avg_duration: number
      current_streak: number
      max_streak: number
    }) => ({
      ...user,
      latest_sentiment: latestSentimentMap.get(user.user_identifier) || 'neutral'
    }))

    return NextResponse.json({ users: usersWithSentiment })
  } catch (error) {
    console.error('Error in users stats API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
