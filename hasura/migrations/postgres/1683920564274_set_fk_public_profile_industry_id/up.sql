alter table "public"."profile"
  add constraint "profile_industry_id_fkey"
  foreign key ("industry_id")
  references "public"."industries"
  ("id") on update restrict on delete restrict;
