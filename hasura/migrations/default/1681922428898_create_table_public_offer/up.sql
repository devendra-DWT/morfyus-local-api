CREATE TABLE "public"."offer"
(
    "id"         serial      NOT NULL,
    "user_id"    integer     NOT NULL,
    "job_id"     integer     NOT NULL,
    "rate"       text        NULL,
    "letter"     text,
    "files"      jsonb,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON UPDATE restrict ON DELETE restrict,
    FOREIGN KEY ("job_id") REFERENCES "public"."job" ("id") ON UPDATE restrict ON DELETE restrict,
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
CREATE TRIGGER "set_public_offer_updated_at"
    BEFORE UPDATE
    ON "public"."offer"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT
    ON TRIGGER "set_public_offer_updated_at" ON "public"."offer"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
