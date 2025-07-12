import { useState } from 'react'

export interface SignupResponse {
  user?: unknown
  error?: string
}

export function useSignup() {
  const [loading, setLoading] = useState(false)

  const signup = async (email: string, password: string): Promise<SignupResponse> => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = (await res.json()) as SignupResponse & { error?: string }
      if (!res.ok) throw new Error(data.error)
      return data
    } catch (err: any) {
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return { signup, loading }
}
