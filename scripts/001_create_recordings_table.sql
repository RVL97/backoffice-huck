-- Tabla para almacenar las grabaciones convertidas a texto
CREATE TABLE IF NOT EXISTS public.recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier TEXT NOT NULL,
  transcription TEXT NOT NULL,
  duration_seconds INTEGER,
  language TEXT DEFAULT 'es',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'archived')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_recordings_user_identifier ON public.recordings(user_identifier);
CREATE INDEX IF NOT EXISTS idx_recordings_status ON public.recordings(status);
CREATE INDEX IF NOT EXISTS idx_recordings_created_at ON public.recordings(created_at DESC);

-- Habilitar RLS
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Allow public read access" ON public.recordings;
DROP POLICY IF EXISTS "Allow public insert access" ON public.recordings;
DROP POLICY IF EXISTS "Allow public update access" ON public.recordings;
DROP POLICY IF EXISTS "Allow public delete access" ON public.recordings;

-- Crear políticas de acceso público para el backoffice
CREATE POLICY "Allow public read access" ON public.recordings FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.recordings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.recordings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.recordings FOR DELETE USING (true);
