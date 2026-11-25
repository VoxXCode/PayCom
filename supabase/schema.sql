CREATE TABLE IF NOT EXISTS public.saved_builds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL DEFAULT auth.uid(),
  build_name TEXT NOT NULL,
  total_price BIGINT NOT NULL DEFAULT 0,
  total_wattage INTEGER NOT NULL DEFAULT 0,
  filled_count INTEGER NOT NULL DEFAULT 0,
  slots_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.saved_builds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own builds" ON public.saved_builds;
CREATE POLICY "Users can view their own builds"
  ON public.saved_builds
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own builds" ON public.saved_builds;
CREATE POLICY "Users can insert their own builds"
  ON public.saved_builds
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own builds" ON public.saved_builds;
CREATE POLICY "Users can update their own builds"
  ON public.saved_builds
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own builds" ON public.saved_builds;
CREATE POLICY "Users can delete their own builds"
  ON public.saved_builds
  FOR DELETE
  USING (auth.uid() = user_id);
