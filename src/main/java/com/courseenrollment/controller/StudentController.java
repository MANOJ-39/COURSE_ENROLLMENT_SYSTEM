package com.courseenrollment.controller;

import com.courseenrollment.dto.EnrollmentView;
import com.courseenrollment.entity.Course;
import com.courseenrollment.service.CourseService;
import com.courseenrollment.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {
    @Autowired
    private CourseService courseService;

    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @PostMapping("/enrollments")
    public ResponseEntity<?> enrollInCourse(@RequestBody Map<String, Integer> payload) {
        try {
            Integer studentId = payload.get("studentId");
            Integer courseId = payload.get("courseId");
            return ResponseEntity.ok(enrollmentService.addEnrollment(studentId, courseId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/enrollments/{studentId}")
    public ResponseEntity<List<EnrollmentView>> getMyEnrollments(@PathVariable Integer studentId) {
        return ResponseEntity.ok(enrollmentService.getByStudentId(studentId));
    }
}
