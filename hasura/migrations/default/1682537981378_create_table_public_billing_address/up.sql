CREATE TABLE "public"."billing_address"
(
    "id"                  serial      NOT NULL,
    "country"             text        NOT NULL,
    "state_or_province"   text        NOT NULL,
    "address_line_first"  text        NOT NULL,
    "address_line_second" text        NOT NULL,
    "city"                text        NOT NULL,
    "zip_or_postal_code"  text        NOT NULL,
    "user_id"             integer     NOT NULL,
    "created_at"          timestamptz NOT NULL DEFAULT now(),
    "updated_at"          timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON UPDATE restrict ON DELETE restrict,
    UNIQUE ("user_id"),
    UNIQUE ("id")
);
CREATE
OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
_new record;
BEGIN
_new := NEW;
_new."updated_at" = NOW();
  RETURN _new;
END;
$$
LANGUAGE plpgsql;
CREATE TRIGGER "set_public_billing_address_updated_at"
    BEFORE UPDATE
    ON "public"."billing_address"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT
ON TRIGGER "set_public_billing_address_updated_at" ON "public"."billing_address"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
