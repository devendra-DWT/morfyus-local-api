CREATE TABLE "public"."profile"
(
    "id"           serial      NOT NULL,
    "company_name" text        NOT NULL,
    "role"         text        NOT NULL,
    "industry"     text        NOT NULL,
    "user_id"      integer     NOT NULL,
    "created_at"   timestamptz NOT NULL DEFAULT now(),
    "updated_at"   timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON UPDATE restrict ON DELETE restrict,
    UNIQUE ("user_id"),
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
CREATE TRIGGER "set_public_profile_updated_at"
    BEFORE UPDATE
    ON "public"."profile"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_profile_updated_at" ON "public"."profile"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
