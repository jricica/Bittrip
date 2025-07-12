import { useState } from 'react'

export interface LoginResponse {
  user?: unknown
  session?: unknown
  error?: string
}

export function useLogin() {
  const [loading, setLoading] = useState(false)

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = (await res.json()) as LoginResponse & { error?: string }
      if (!res.ok) throw new Error(data.error)
      return data
    } catch (err: any) {
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return { login, loading }
}
