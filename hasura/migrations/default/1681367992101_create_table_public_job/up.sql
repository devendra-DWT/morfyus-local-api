CREATE TABLE "public"."job"
(
    "id"               serial      NOT NULL,
    "user_id"          integer     NOT NULL,
    "description"      text        NOT NULL,
    "category"         text        NOT NULL,
    "skills"           JSONB       NOT NULL,
    "payment_option"   text        NOT NULL,
    "price_max"        integer     NULL,
    "price_min"        integer     NULL,
    "fix_price"        integer     NULL,
    "headline"         text        NOT NULL,
    "publication_cost" text        NOT NULL,
    "files"            JSONB       NULL,
    "created_at"       timestamptz NOT NULL DEFAULT now(),
    "updated_at"       timestamptz NOT NULL DEFAULT now(),
    "is_active"        boolean     NOT NULL DEFAULT true,
    "is_deleted"       boolean     NOT NULL DEFAULT false,
    "is_admin_deleted" boolean     NOT NULL DEFAULT false,
    "deleted_reason"   text        NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON UPDATE restrict ON DELETE restrict,
    UNIQUE ("id")
);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
    RETURNS TRIGGER AS
$$
DECLARE
    _new record;
BEGIN
    _new := NEW;
    _new."updated_at" = NOW();
    RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_job_updated_at"
    BEFORE UPDATE
    ON "public"."job"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_job_updated_at" ON "public"."job"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
