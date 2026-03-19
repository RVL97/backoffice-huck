import { generateObject } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
import { z } from 'zod'

const SOFT_SKILLS = [
  'comunicacion_efectiva',
  'escucha_activa',
  'trabajo_en_equipo',
  'empatia',
  'adaptabilidad',
  'gestion_del_tiempo',
  'responsabilidad',
  'pensamiento_critico'
] as const

const softSkillsSchema = z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']).describe('El sentimiento general del audio'),
  soft_skills: z.array(z.enum(SOFT_SKILLS)).describe('Lista de habilidades blandas detectadas en el audio'),
  reasoning: z.string().describe('Explicacion breve de por que se detectaron esas habilidades')
})

export type AnalysisResult = z.infer<typeof softSkillsSchema>

export async function analyzeTranscription(transcription: string): Promise<AnalysisResult> {
  const systemPrompt = `Eres un experto en analisis de habilidades blandas. Tu tarea es analizar transcripciones de audio de usuarios y detectar las habilidades blandas que demuestran en su relato.

Las habilidades blandas que puedes detectar son:
- comunicacion_efectiva: Expresar ideas con claridad, tanto verbalmente como por escrito, y adaptarse al publico.
- escucha_activa: Prestar atencion plena, comprender el mensaje y dar retroalimentacion adecuada.
- trabajo_en_equipo: Colaborar con otros para alcanzar objetivos comunes, respetando diferentes perspectivas.
- empatia: Comprender y considerar las emociones y puntos de vista de los demas.
- adaptabilidad: Ajustarse a cambios, imprevistos y nuevas situaciones con flexibilidad.
- gestion_del_tiempo: Organizar tareas de forma eficiente para cumplir plazos.
- responsabilidad: Cumplir con obligaciones y responder ante las consecuencias de las acciones.
- pensamiento_critico: Analizar informacion de forma objetiva para tomar decisiones informadas.

Tambien debes clasificar el sentimiento general del audio como positivo, negativo o neutral.

En un mismo audio se puede detectar ninguna, una o mas de una de estas habilidades blandas. Solo incluye las habilidades que esten claramente demostradas en el relato.`

  try {
    console.log('[v0] Starting AI analysis for transcription:', transcription.substring(0, 100))
    
    const result = await generateObject({
      model: anthropic('claude-sonnet-4-6'),
      schema: softSkillsSchema,
      system: systemPrompt,
      prompt: `Transcripcion a analizar:
"${transcription}"

Detecta:
1. El sentimiento general (positive, negative, neutral)
2. Las habilidades blandas que el usuario DEMUESTRA en lo que cuenta (puede ser ninguna, una o varias)
3. Una breve explicacion de tu analisis

IMPORTANTE: Si el usuario menciona que hizo algo que demuestra una habilidad (ej: "comunique bien", "trabaje en equipo", "maneje una crisis"), incluye esa habilidad en la lista.`,
    })

    console.log('[v0] AI analysis result:', JSON.stringify(result.object))
    return result.object
  } catch (error) {
    console.error('[v0] Error analyzing transcription:', error instanceof Error ? error.message : error)
    // Return default values if AI fails
    return {
      sentiment: 'neutral' as const,
      soft_skills: [],
      reasoning: `Error en analisis: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Map internal keys to display labels
export const softSkillLabels: Record<string, string> = {
  comunicacion_efectiva: 'Comunicacion Efectiva',
  escucha_activa: 'Escucha Activa',
  trabajo_en_equipo: 'Trabajo en Equipo',
  empatia: 'Empatia',
  adaptabilidad: 'Adaptabilidad',
  gestion_del_tiempo: 'Gestion del Tiempo',
  responsabilidad: 'Responsabilidad',
  pensamiento_critico: 'Pensamiento Critico'
}
