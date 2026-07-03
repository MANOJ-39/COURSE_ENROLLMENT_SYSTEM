package com.courseenrollment.controller;

import com.courseenrollment.dto.EnrollmentView;
import com.courseenrollment.entity.Course;
import com.courseenrollment.entity.Student;
import com.courseenrollment.service.CourseService;
import com.courseenrollment.service.EnrollmentService;
import com.courseenrollment.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
    @Autowired
    private StudentService studentService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private EnrollmentService enrollmentService;

    @PostMapping("/students")
    public ResponseEntity<?> addStudent(@RequestBody Map<String, Object> payload) {
        try {
            String name = (String) payload.get("name");
            String email = (String) payload.get("email");
            String password = (String) payload.get("password");
            Student student = studentService.addStudent(name, email, password);
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @PostMapping("/courses")
    public ResponseEntity<?> addCourse(@RequestBody Map<String, Object> payload) {
        try {
            String name = (String) payload.get("name");
            Integer credits = (Integer) payload.get("credits");
            Course course = courseService.addCourse(name, credits);
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/enrollments")
    public ResponseEntity<List<EnrollmentView>> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentService.getAllDetailed());
    }

    @PostMapping("/enrollments")
    public ResponseEntity<?> addEnrollment(@RequestBody Map<String, Integer> payload) {
        try {
            Integer studentId = payload.get("studentId");
            Integer courseId = payload.get("courseId");
            return ResponseEntity.ok(enrollmentService.addEnrollment(studentId, courseId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/enrollments/{enrollmentId}")
    public ResponseEntity<?> updateEnrollment(
            @PathVariable Integer enrollmentId,
            @RequestBody Map<String, Integer> payload) {
        try {
            Integer newCourseId = payload.get("courseId");
            enrollmentService.updateEnrollmentCourse(enrollmentId, newCourseId);
            return ResponseEntity.ok("Enrollment updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/enrollments/{enrollmentId}")
    public ResponseEntity<?> deleteEnrollment(@PathVariable Integer enrollmentId) {
        try {
            enrollmentService.deleteById(enrollmentId);
            return ResponseEntity.ok("Enrollment deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/enrollments/search")
    public ResponseEntity<List<EnrollmentView>> searchEnrollments(@RequestParam String keyword) {
        return ResponseEntity.ok(enrollmentService.search(keyword));
    }

    @GetMapping("/reports/students-per-course")
    public ResponseEntity<List<Object[]>> getStudentsPerCourse() {
        return ResponseEntity.ok(enrollmentService.getEnrollmentCountPerCourse());
    }
}
