alter table "public"."draft_recommendations"
  add constraint "draft_recommendations_sender_email_fkey"
  foreign key ("sender_email")
  references "public"."users"
  ("email") on update no action on delete no action;
