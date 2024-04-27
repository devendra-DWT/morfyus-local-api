alter table "public"."status_of_recommendations" alter column "id" set default nextval('status_of_recommendations_id_seq'::regclass);
