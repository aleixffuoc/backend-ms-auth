import crypto from 'crypto'

export function generateSecretHash({ clientId, clientSecret, username }: { clientId: string; clientSecret: string; username: string }) {
  return crypto
    .createHmac('SHA256', clientSecret)
    .update(username + clientId)
    .digest('base64')
}
