import * as Joi from 'joi';
import * as dotenv from 'dotenv';

dotenv.config();

const appConfig = () => ({
  database_url: process.env.DATABASE_URL,
  api_url: process.env.API_URL,
  frontend_url: process.env.FRONTEND_URL,

  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  salt_rounds: process.env.SALT_ROUNDS,

  digitalocean_endpoint: process.env.DIGITALOCEAN_ENDPOINT,
  digitalocean_region: process.env.DIGITALOCEAN_REGION,
  digitalocean_access_key_id: process.env.DIGITALOCEAN_ACCESS_KEY_ID,
  digitalocean_secret_access_key: process.env.DIGITALOCEAN_SECRET_ACCESS_KEY,
  digitalocean_bucket: process.env.DIGITALOCEAN_BUCKET,

  postmark_server_token: process.env.POSTMARK_SERVER_TOKEN,
  postmark_sender_email: process.env.POSTMARK_SENDER_EMAIL,
  postmark_sender_message_stream: process.env.POSTMARK_SENDER_MESSAGE_STREAM,

  mailer_lite_api_key: process.env.MAILER_LITE_API_KEY,
  mailer_lite_group_id: process.env.MAILER_LITE_GROUP_ID,
});

const ConfigValidationSchema = Joi.object({
  database_url: Joi.string().required(),
  api_url: Joi.string().required(),
  frontend_url: Joi.string().required(),

  jwt_access_secret: Joi.string().required(),
  jwt_access_expires_in: Joi.string().required(),
  jwt_refresh_secret: Joi.string().required(),
  jwt_refresh_expires_in: Joi.string().required(),
  salt_rounds: Joi.string().required(),

  digitalocean_endpoint: Joi.string().required(),
  digitalocean_region: Joi.string().required(),
  digitalocean_access_key_id: Joi.string().required(),
  digitalocean_secret_access_key: Joi.string().required(),
  digitalocean_bucket: Joi.string().required(),

  postmark_server_token: Joi.string().required(),
  postmark_sender_email: Joi.string().required(),
  postmark_sender_message_stream: Joi.string().required(),

  mailer_lite_api_key: Joi.string().required(),
  mailer_lite_group_id: Joi.string().required(),
});

export interface EnvironmentVariables {
  database_url: string;
  api_url: string;
  frontend_url: string;

  jwt_access_secret: string;
  jwt_access_expires_in: string;
  jwt_refresh_secret: string;
  jwt_refresh_expires_in: string;
  salt_rounds: string;

  digitalocean_endpoint: string;
  digitalocean_region: string;
  digitalocean_access_key_id: string;
  digitalocean_secret_access_key: string;
  digitalocean_bucket: string;

  postmark_server_token: string;
  postmark_sender_email: string;
  postmark_sender_message_stream: string;

  mailer_lite_api_key: string;
  mailer_lite_group_id: string;
}

export const validateConfig = (): EnvironmentVariables => {
  const { value, error } = ConfigValidationSchema.validate(appConfig(), {
    abortEarly: true,
    allowUnknown: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  return value;
};
