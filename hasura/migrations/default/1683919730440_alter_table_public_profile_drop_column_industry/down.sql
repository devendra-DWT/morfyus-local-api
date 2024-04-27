alter table "public"."profile" alter column "industry" drop not null;
alter table "public"."profile" add column "industry" text;
