import { onCall } from 'firebase-functions/v2/https'

export const hello = onCall({ cors: true }, async (request) => {
  const uid = request.auth?.uid ?? null

  return {
    ok: true,
    message: 'Hello from Cloud Functions',
    uid,
  }
})
