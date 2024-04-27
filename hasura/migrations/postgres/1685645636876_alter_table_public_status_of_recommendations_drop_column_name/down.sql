alter table "public"."status_of_recommendations" alter column "name" drop not null;
alter table "public"."status_of_recommendations" add column "name" text;
