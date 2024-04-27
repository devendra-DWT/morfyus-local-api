alter table "public"."draft_recommendations"
  add constraint "draft_recommendations_recipient_email_fkey"
  foreign key ("recipient_email")
  references "public"."users"
  ("email") on update restrict on delete restrict;
