alter table "public"."offer" add constraint "offer_user_id_job_id_key" unique ("user_id", "job_id");
