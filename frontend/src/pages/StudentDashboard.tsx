import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { LogOut, BookOpen, FileText, Plus } from 'lucide-react'

interface Course {
  courseId: number
  courseName: string
  credits: number
}

interface Enrollment {
  enrollmentId: number
  studentName: string
  courseName: string
  enrollmentDate: string
}

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'courses' | 'enrollments'>('courses')
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [studentName] = useState(localStorage.getItem('studentName') || 'Student')
  const [studentId] = useState(parseInt(localStorage.getItem('studentId') || '0'))
  const [token] = useState(localStorage.getItem('token') || '')

  useEffect(() => {
    if (!token || !studentId) {
      navigate('/login')
      return
    }
    loadData()
  }, [activeTab])

  const loadData = async () => {
    switch (activeTab) {
      case 'courses':
        setCourses(await api.student.getCourses(token))
        break
      case 'enrollments':
        setEnrollments(await api.student.getMyEnrollments(token, studentId))
        break
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourseId) return

    const result = await api.student.enrollInCourse(token, {
      studentId,
      courseId: parseInt(selectedCourseId)
    })

    if (result.enrollmentId) {
      setSelectedCourseId('')
      alert('Successfully enrolled in the course!')
      loadData()
    } else {
      alert(result || 'Failed to enroll in the course')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome, {studentName}</p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen p-4">
          <nav className="space-y-2">
            <Button
              variant={activeTab === 'courses' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('courses')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              View Courses
            </Button>
            <Button
              variant={activeTab === 'enrollments' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('enrollments')}
            >
              <FileText className="h-4 w-4 mr-2" />
              My Enrollments
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enroll in a Course</CardTitle>
                  <CardDescription>Select a course from the list below to enroll</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEnroll} className="space-y-4">
                    <div>
                      <Label>Course ID</Label>
                      <Input
                        type="number"
                        placeholder="Enter course ID from the table below"
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit">
                      <Plus className="h-4 w-4 mr-2" />
                      Enroll Now
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Course Name</TableHead>
                        <TableHead>Credits</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.courseId}>
                          <TableCell>{course.courseId}</TableCell>
                          <TableCell>{course.courseName}</TableCell>
                          <TableCell>{course.credits}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'enrollments' && (
            <Card>
              <CardHeader>
                <CardTitle>My Enrollments</CardTitle>
                <CardDescription>Courses you are currently enrolled in</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Enrollment Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500">
                          No enrollments found. Enroll in a course to get started!
                        </TableCell>
                      </TableRow>
                    ) : (
                      enrollments.map((enrollment) => (
                        <TableRow key={enrollment.enrollmentId}>
                          <TableCell>{enrollment.enrollmentId}</TableCell>
                          <TableCell>{enrollment.courseName}</TableCell>
                          <TableCell>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
