alter table "public"."job"
  add constraint "job_user_id_fkey"
  foreign key ("user_id")
  references "public"."profile"
  ("user_id") on update restrict on delete set null;
