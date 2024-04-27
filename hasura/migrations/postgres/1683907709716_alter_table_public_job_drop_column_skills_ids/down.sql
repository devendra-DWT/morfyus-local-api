alter table "public"."job" alter column "skills_ids" drop not null;
alter table "public"."job" add column "skills_ids" jsonb;
