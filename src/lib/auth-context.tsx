import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { isLocalAuth } from '@/lib/auth-mode'
import { getLocalSession, signInLocal, signOutLocal } from '@/lib/local-auth'
import { getUserProfile, upsertUserProfile } from '@/services/users'
import type { AuthUser, UserProfile } from '@/types/user'

const LOGOUT_RESET_DELAY_MS = 1000

type AuthContextType = {
  user: AuthUser | null
  userProfile: UserProfile | null
  loading: boolean
  profileLoading: boolean
  isLocal: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  logout: () => void
  forceRefresh: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  profileLoading: true,
  isLocal: false,
  signInWithEmail: async () => {},
  logout: () => {},
  forceRefresh: () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)
  const [isLoggedOut, setIsLoggedOut] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const local = isLocalAuth()

  const fetchUserProfile = useCallback(async (nextUser: AuthUser) => {
    try {
      setProfileLoading(true)
      setUserProfile(await upsertUserProfile(nextUser))
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      try {
        setUserProfile(await getUserProfile(nextUser.uid))
      } catch {
        setUserProfile(null)
      }
    } finally {
      setProfileLoading(false)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setUserProfile(null)
      return
    }
    await fetchUserProfile(user)
  }, [user, fetchUserProfile])

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      if (local) {
        const nextUser = signInLocal(email, password)
        setUser(nextUser)
        setIsLoggedOut(false)
        await fetchUserProfile(nextUser)
        return
      }

      const { auth } = await import('@/lib/firebase')
      const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = await import('firebase/auth')
      try {
        await signInWithEmailAndPassword(auth, email, password)
      } catch {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    },
    [local, fetchUserProfile]
  )

  useEffect(() => {
    if (local) {
      const session = getLocalSession()
      setUser(session)
      setLoading(false)
      if (session) {
        void fetchUserProfile(session)
      } else {
        setUserProfile(null)
        setProfileLoading(false)
      }
      return
    }

    let isActive = true
    setLoading(true)

    let unsubscribe = () => {}

    void import('@/lib/firebase').then(async ({ auth }) => {
      const { onAuthStateChanged, signInAnonymously } = await import('firebase/auth')

      unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
        if (!isActive) {
          return
        }

        setUser(
          nextUser
            ? {
                uid: nextUser.uid,
                email: nextUser.email,
                displayName: nextUser.displayName,
                photoURL: nextUser.photoURL,
                isAnonymous: nextUser.isAnonymous,
              }
            : null
        )
        setLoading(false)

        if (!nextUser) {
          const allowAnonymous = import.meta.env.VITE_ALLOW_ANONYMOUS_USERS !== 'false'

          if (!isLoggedOut && allowAnonymous) {
            try {
              await signInAnonymously(auth)
            } catch (error) {
              console.error('Failed to create anonymous user:', error)
              if (isActive) {
                setUserProfile(null)
                setProfileLoading(false)
              }
            }
          } else {
            if (isActive) {
              setUserProfile(null)
              setProfileLoading(false)
            }

            if (isLoggedOut) {
              setTimeout(() => {
                if (isActive) {
                  setIsLoggedOut(false)
                }
              }, LOGOUT_RESET_DELAY_MS)
            }
          }
        } else {
          if (isActive) {
            setIsLoggedOut(false)
          }

          if (!isLoggedOut && isActive) {
            void fetchUserProfile({
              uid: nextUser.uid,
              email: nextUser.email,
              displayName: nextUser.displayName,
              photoURL: nextUser.photoURL,
              isAnonymous: nextUser.isAnonymous,
            })
          } else if (isActive) {
            setUserProfile(null)
            setProfileLoading(false)
          }
        }
      })
    })

    return () => {
      isActive = false
      unsubscribe()
    }
  }, [local, isLoggedOut, refreshTrigger, fetchUserProfile])

  const logout = () => {
    setIsLoggedOut(true)
    setUser(null)
    setUserProfile(null)
    if (local) {
      signOutLocal()
      return
    }
    void import('@/lib/firebase').then(({ auth }) => {
      void import('firebase/auth').then(({ signOut }) => {
        void signOut(auth)
      })
    })
  }

  const forceRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        profileLoading,
        isLocal: local,
        signInWithEmail,
        logout,
        forceRefresh,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
