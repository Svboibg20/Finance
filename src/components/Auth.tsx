'use client'

import { useState } from 'react'
import { auth } from '../lib/firebase'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { Button } from './ui/button'

export function Auth() {
  const [isLoading, setIsLoading] = useState(false)

  const signInWithGoogle = async () => {
    setIsLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Error signing in with Google', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Button onClick={signInWithGoogle} disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In with Google'}
      </Button>
    </div>
  )
}

