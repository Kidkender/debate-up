export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  database: {
    connectionString: process.env.DATABASE_URL,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    sender_name_default: process.env.MAIL_SENDER_NAME_DEFAULT,
    mail_sender_default: process.env.MAIL_SENDER_DEFAULT,
  },
});

export interface ConfigType {
  jwt: {
    secret: string;
  };
  database: {
    connectionString: string;
  };
  mail: {
    host: string;
    port: string;
    user: string;
    password: string;
    sender_name_default: string;
    mail_sender_default: string;
  };
}
