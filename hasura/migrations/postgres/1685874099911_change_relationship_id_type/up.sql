ALTER TABLE public.draft_recommendations
ALTER COLUMN relationship_id TYPE integer USING relationship_id::integer;
