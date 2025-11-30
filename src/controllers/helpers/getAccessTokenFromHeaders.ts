import { Request } from 'express'

export function getAccessTokenFromHeaders(req: Request): string | undefined {
  const authHeader = req.headers['authorization']
  return authHeader && authHeader.split(' ')[1]
}
