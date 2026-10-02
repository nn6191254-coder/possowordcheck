import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: Number(process.env.PORT ?? 5000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/securecheck',
  jwtSecret: process.env.JWT_SECRET ?? 'development-secret-change-me',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  adminEmail: process.env.ADMIN_EMAIL ?? 'admin@securecheck.local',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'ChangeMeStrongly!',
}
