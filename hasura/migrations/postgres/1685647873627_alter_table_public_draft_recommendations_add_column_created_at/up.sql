alter table "public"."draft_recommendations" add column "created_at" timestamptz
 null default now();
