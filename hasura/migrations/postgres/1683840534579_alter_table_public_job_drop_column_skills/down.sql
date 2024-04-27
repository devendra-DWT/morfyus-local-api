alter table "public"."job" alter column "skills" drop not null;
alter table "public"."job" add column "skills" jsonb;
