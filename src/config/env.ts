export const env = () => ({
  environment: process.env.NODE_ENV?.trim() || 'development',

  postgres: {
    host: process.env.PG_HOST!,
    port: +process.env.PG_PORT!,
    username: process.env.PG_USERNAME!,
    password: process.env.PG_PASSWORD!,
    database: process.env.PG_DATABASE!,
    synchronize: process.env.PG_SYNCHRONIZE === 'true' || true,
  },

  auth: {
    activationCodeExpireIn: +(
      (process.env.ACTIVATION_CODE_EXPIRE_IN || 3 * 60 * 60) // 3 min
    ),
    resetPasswordCodeExpireIn: +(
      (process.env.RESET_PASSWORD_CODE_EXPIRE_IN || 3 * 60 * 60) // 3 min
    ),
  },
  
  jwt: {
    secret: process.env.JWT_SECRET!,
    accessExpireIn: +(process.env.JWT_ACCESS_EXPIRE_IN || 60 * 60 * 60), // 1 hour
    refreshExpireIn: +(
      (process.env.JWT_REFRESH_EXPIRE_IN || 12 * 30 * 24 * 60 * 60) // 1 year
    ),
  },

  bcrypt: {
    salt: +(process.env.BCRYPT_SALT || 1),
    pepper: process.env.BCRYPT_PAPER,
  },
});
