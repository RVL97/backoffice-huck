export type SoftSkill = 
  | 'comunicacion_efectiva'
  | 'escucha_activa'
  | 'trabajo_en_equipo'
  | 'empatia'
  | 'adaptabilidad'
  | 'gestion_del_tiempo'
  | 'responsabilidad'
  | 'pensamiento_critico'

export interface Recording {
  id: string
  user_identifier: string
  transcription: string
  duration_seconds: number | null
  language: string
  status: 'pending' | 'reviewed' | 'archived'
  sentiment: 'positive' | 'negative' | 'neutral'
  soft_skills: SoftSkill[]
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface UserStats {
  user_identifier: string
  total_recordings: number
  avg_duration: number
  current_streak: number
  max_streak: number
}

export interface CreateRecordingInput {
  user_identifier: string
  transcription: string
  duration_seconds?: number
  language?: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  metadata?: Record<string, unknown>
}

export interface UpdateRecordingInput {
  status?: 'pending' | 'reviewed' | 'archived'
  transcription?: string
  metadata?: Record<string, unknown>
}
