-- Tabla para almacenar los reportes de usuarios generados por IA
CREATE TABLE IF NOT EXISTS public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier TEXT NOT NULL UNIQUE,
  report TEXT NOT NULL,
  skills_count JSONB DEFAULT '{}',
  sentiment_count JSONB DEFAULT '{}',
  total_recordings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indice para buscar por usuario
CREATE INDEX IF NOT EXISTS idx_user_reports_user_identifier ON public.user_reports(user_identifier);

-- Habilitar RLS
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- Politicas de acceso publico para el backoffice
CREATE POLICY "Allow public read access" ON public.user_reports FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.user_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.user_reports FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.user_reports FOR DELETE USING (true);
