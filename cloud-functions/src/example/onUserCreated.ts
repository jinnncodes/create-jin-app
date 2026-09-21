import { auth } from 'firebase-functions/v1'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

export const onUserCreated = auth.user().onCreate(async (user) => {
  const db = getFirestore()

  await db.doc(`users/${user.uid}`).set(
    {
      id: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? '',
      photoUrl: user.photoURL ?? null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  )
})
