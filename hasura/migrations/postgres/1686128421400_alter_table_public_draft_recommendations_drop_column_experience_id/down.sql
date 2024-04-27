alter table "public"."draft_recommendations" alter column "experience_id" drop not null;
alter table "public"."draft_recommendations" add column "experience_id" int4;
