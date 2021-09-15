import { registerAs } from '@nestjs/config'

export default registerAs('mongodb', () => ({
  uri: process.env.DATABASE_URI,
  port: process.env.DATABASE_PORT || 27017,
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PASS,
}))
