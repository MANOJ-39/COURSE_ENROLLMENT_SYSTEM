import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { GraduationCap } from 'lucide-react'

export default function LoginPage() {
  const [loginType, setLoginType] = useState<'admin' | 'student'>('admin')
  const [credentials, setCredentials] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      let response
      if (loginType === 'admin') {
        response = await api.adminLogin({ username: credentials.username, password: credentials.password })
      } else {
        response = await api.studentLogin({ email: credentials.email, password: credentials.password })
      }

      if (response.token) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('role', response.role)
        if (response.studentId) localStorage.setItem('studentId', response.studentId)
        if (response.studentName) localStorage.setItem('studentName', response.studentName)
        navigate(loginType === 'admin' ? '/admin' : '/student')
      } else {
        setError(response)
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Course Enrollment System</CardTitle>
          <CardDescription>Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button
              variant={loginType === 'admin' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => { setLoginType('admin'); setError('') }}
            >
              Admin
            </Button>
            <Button
              variant={loginType === 'student' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => { setLoginType('student'); setError('') }}
            >
              Student
            </Button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginType === 'admin' ? (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter admin username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter student email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
