# Course Enrollment System

A modern web-based course enrollment system built with Spring Boot (backend) and React (frontend). This application provides role-based access for administrators and students to manage courses, enrollments, and view reports.

## Features

### Admin Features
- Add and manage students
- Add and manage courses
- Create and manage enrollments
- View enrollment reports
- Search enrollments by student name or course name
- View students per course statistics
- Delete enrollments

### Student Features
- View available courses
- Enroll in courses
- View personal enrollments

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security with JWT authentication
- MySQL 8.0
- Maven

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui components
- React Router DOM
- Lucide React icons

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and npm
- MySQL 8.0+

## Database Setup

1. Install MySQL if not already installed
2. Create a database named `CourseEnrollmentSystem`:
   ```sql
   CREATE DATABASE CourseEnrollmentSystem;
   ```
3. The application will automatically create the required tables using JPA's `ddl-auto=update` setting
4. Alternatively, you can manually run the schema.sql file located in `src/main/resources/schema.sql`

## Backend Setup

1. Navigate to the project root directory
2. Update database credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/CourseEnrollmentSystem
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```
3. Build the project using Maven:
   ```bash
   mvn clean install
   ```
4. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
5. The backend API will be available at `http://localhost:8080`

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The frontend will be available at `http://localhost:5173`

## Default Credentials

### Admin
- Username: `manoj`
- Password: `manoj123`

### Student
- Students must be created by the admin first
- Use the admin dashboard to add students with their email and password

## Project Structure

```
CourseEnrollmentSystem/
├── src/
│   └── main/
│       ├── java/com/courseenrollment/
│       │   ├── entity/          # JPA entities (Student, Course, Enrollment)
│       │   ├── repository/      # Spring Data JPA repositories
│       │   ├── service/         # Business logic layer
│       │   ├── controller/      # REST API controllers
│       │   ├── security/        # JWT authentication and security config
│       │   ├── dto/             # Data transfer objects
│       │   ├── util/            # Utility classes (Password hashing)
│       │   └── CourseEnrollmentSystemApplication.java
│       └── resources/
│           ├── application.properties
│           └── schema.sql
├── frontend/
│   ├── src/
│   │   ├── components/ui/       # Reusable UI components
│   │   ├── lib/                 # Utilities and API client
│   │   ├── pages/               # Page components (Login, Admin, Student dashboards)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── pom.xml
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/student/login` - Student login

### Admin Endpoints (Requires ADMIN role)
- `GET /api/admin/students` - Get all students
- `POST /api/admin/students` - Add new student
- `GET /api/admin/courses` - Get all courses
- `POST /api/admin/courses` - Add new course
- `GET /api/admin/enrollments` - Get all enrollments
- `POST /api/admin/enrollments` - Add enrollment
- `PUT /api/admin/enrollments/{id}` - Update enrollment
- `DELETE /api/admin/enrollments/{id}` - Delete enrollment
- `GET /api/admin/enrollments/search?keyword=` - Search enrollments
- `GET /api/admin/reports/students-per-course` - Get enrollment statistics

### Student Endpoints (Requires STUDENT role)
- `GET /api/student/courses` - Get all courses
- `POST /api/student/enrollments` - Enroll in a course
- `GET /api/student/enrollments/{studentId}` - Get student's enrollments

## Usage

### Admin Workflow
1. Login with admin credentials
2. Add courses (e.g., "Introduction to Programming", 3 credits)
3. Add students with their email and password
4. Create enrollments by selecting student ID and course ID
5. View reports and search enrollments as needed

### Student Workflow
1. Login with student credentials (email and password)
2. View available courses
3. Enroll in courses by entering the course ID
4. View personal enrollments

## Security

- Passwords are hashed using SHA-256 before storage
- JWT tokens are used for authentication
- Role-based access control (ADMIN/STUDENT)
- CORS enabled for frontend-backend communication

## Development

### Running Backend Tests
```bash
mvn test
```

### Building for Production

#### Backend
```bash
mvn clean package
java -jar target/course-enrollment-system-1.0.0.jar
```

#### Frontend
```bash
cd frontend
npm run build
```

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Verify database credentials in application.properties
- Check that the database `CourseEnrollmentSystem` exists

### Frontend Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Ensure Node.js version is 18 or higher

### CORS Issues
- Verify CORS configuration in SecurityConfig.java
- Ensure frontend URL (http://localhost:5173) is in allowed origins

## License

This project is for educational purposes.
