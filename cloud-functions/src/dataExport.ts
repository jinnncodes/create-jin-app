import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { getFirestore } from 'firebase-admin/firestore'

const EXPORTABLE_COLLECTIONS = ['users'] as const

export const exportUserData = onCall({ cors: true }, async (request) => {
  if (!request.auth?.uid) {
    throw new HttpsError('unauthenticated', 'Sign in required to export data.')
  }

  const uid = request.auth.uid
  const db = getFirestore()
  const exportedAt = new Date().toISOString()
  const data: Record<string, unknown> = {
    uid,
    exportedAt,
  }

  for (const collectionName of EXPORTABLE_COLLECTIONS) {
    const ownDoc = await db.doc(`${collectionName}/${uid}`).get()
    data[collectionName] = ownDoc.exists
      ? { id: ownDoc.id, ...ownDoc.data() }
      : null
  }

  return data
})
