import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { LogOut, Users, BookOpen, FileText, Search, Trash2, Edit } from 'lucide-react'

interface Student {
  studentId: number
  studentName: string
  email: string
}

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

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'students' | 'courses' | 'enrollments' | 'reports'>('students')
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [reportData, setReportData] = useState<[string, number][]>([])
  const [token] = useState(localStorage.getItem('token') || '')

  // Form states
  const [newStudent, setNewStudent] = useState({ name: '', email: '', password: '' })
  const [newCourse, setNewCourse] = useState({ name: '', credits: '' })
  const [newEnrollment, setNewEnrollment] = useState({ studentId: '', courseId: '' })
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    switch (activeTab) {
      case 'students':
        setStudents(await api.admin.getStudents(token))
        break
      case 'courses':
        setCourses(await api.admin.getCourses(token))
        break
      case 'enrollments':
        setEnrollments(await api.admin.getEnrollments(token))
        break
      case 'reports':
        const data = await api.admin.getStudentsPerCourse(token)
        setReportData(data)
        break
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await api.admin.addStudent(token, newStudent)
    if (result.studentId) {
      setNewStudent({ name: '', email: '', password: '' })
      loadData()
    }
  }

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await api.admin.addCourse(token, { name: newCourse.name, credits: parseInt(newCourse.credits) })
    if (result.courseId) {
      setNewCourse({ name: '', credits: '' })
      loadData()
    }
  }

  const handleAddEnrollment = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await api.admin.addEnrollment(token, {
      studentId: parseInt(newEnrollment.studentId),
      courseId: parseInt(newEnrollment.courseId)
    })
    if (result.enrollmentId) {
      setNewEnrollment({ studentId: '', courseId: '' })
      loadData()
    }
  }

  const handleDeleteEnrollment = async (enrollmentId: number) => {
    await api.admin.deleteEnrollment(token, enrollmentId)
    loadData()
  }

  const handleSearch = async () => {
    if (searchKeyword.trim()) {
      const results = await api.admin.searchEnrollments(token, searchKeyword)
      setEnrollments(results)
    } else {
      loadData()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen p-4">
          <nav className="space-y-2">
            <Button
              variant={activeTab === 'students' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('students')}
            >
              <Users className="h-4 w-4 mr-2" />
              Students
            </Button>
            <Button
              variant={activeTab === 'courses' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('courses')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Courses
            </Button>
            <Button
              variant={activeTab === 'enrollments' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('enrollments')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Enrollments
            </Button>
            <Button
              variant={activeTab === 'reports' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('reports')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {activeTab === 'students' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Student</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddStudent} className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={newStudent.name}
                          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={newStudent.email}
                          onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Password</Label>
                        <Input
                          type="password"
                          value={newStudent.password}
                          onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit">Add Student</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.studentId}>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>{student.studentName}</TableCell>
                          <TableCell>{student.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCourse} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Course Name</Label>
                        <Input
                          value={newCourse.name}
                          onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Credits</Label>
                        <Input
                          type="number"
                          value={newCourse.credits}
                          onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit">Add Course</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Courses</CardTitle>
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
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Enrollment</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddEnrollment} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Student ID</Label>
                        <Input
                          type="number"
                          value={newEnrollment.studentId}
                          onChange={(e) => setNewEnrollment({ ...newEnrollment, studentId: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Course ID</Label>
                        <Input
                          type="number"
                          value={newEnrollment.courseId}
                          onChange={(e) => setNewEnrollment({ ...newEnrollment, courseId: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit">Add Enrollment</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Search Enrollments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search by student name or course name"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <Button onClick={handleSearch}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Enrollments</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map((enrollment) => (
                        <TableRow key={enrollment.enrollmentId}>
                          <TableCell>{enrollment.enrollmentId}</TableCell>
                          <TableCell>{enrollment.studentName}</TableCell>
                          <TableCell>{enrollment.courseName}</TableCell>
                          <TableCell>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteEnrollment(enrollment.enrollmentId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'reports' && (
            <Card>
              <CardHeader>
                <CardTitle>Students per Course Report</CardTitle>
                <CardDescription>Number of students enrolled in each course</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Students Enrolled</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.map(([courseName, count], index) => (
                      <TableRow key={index}>
                        <TableCell>{courseName}</TableCell>
                        <TableCell>{count}</TableCell>
                      </TableRow>
                    ))}
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
