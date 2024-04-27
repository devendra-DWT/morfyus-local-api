ALTER TABLE public.draft_recommendations
ALTER COLUMN experience_id TYPE integer USING experience_id::integer;
