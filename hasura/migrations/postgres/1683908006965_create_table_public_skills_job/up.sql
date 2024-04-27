CREATE TABLE "public"."skills_job" ("skill_id" integer NOT NULL, "job_id" integer NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "id" serial NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("job_id") REFERENCES "public"."job"("id") ON UPDATE restrict ON DELETE restrict);COMMENT ON TABLE "public"."skills_job" IS E'Relationship between skills and job table';