import { Request } from 'express'

export function getAWSClientSecretFromHeaders(req: Request) {
  return req.headers['aws-client-secret'] as string | undefined
}
