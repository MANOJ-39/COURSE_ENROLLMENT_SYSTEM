package com.courseenrollment.service;

import com.courseenrollment.dto.EnrollmentView;
import com.courseenrollment.entity.Course;
import com.courseenrollment.entity.Enrollment;
import com.courseenrollment.entity.Student;
import com.courseenrollment.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EnrollmentService {
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private StudentService studentService;

    @Autowired
    private CourseService courseService;

    public Enrollment addEnrollment(Integer studentId, Integer courseId) {
        if (!studentService.exists(studentId)) {
            throw new RuntimeException("No student found with ID " + studentId + ".");
        }
        if (!courseService.exists(courseId)) {
            throw new RuntimeException("No course found with ID " + courseId + ".");
        }

        Student student = studentService.getStudentById(studentId);
        Course course = courseService.getCourseById(courseId);

        try {
            return enrollmentRepository.save(new Enrollment(student, course, LocalDate.now()));
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("This student is already enrolled in that course.");
        }
    }

    public List<EnrollmentView> getAllDetailed() {
        return enrollmentRepository.findAllDetailed();
    }

    public List<EnrollmentView> getByStudentId(Integer studentId) {
        return enrollmentRepository.findByStudentIdDetailed(studentId);
    }

    public List<EnrollmentView> search(String keyword) {
        return enrollmentRepository.search(keyword);
    }

    public void updateEnrollmentCourse(Integer enrollmentId, Integer newCourseId) {
        if (!courseService.exists(newCourseId)) {
            throw new RuntimeException("No course found with ID " + newCourseId + ".");
        }

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("No enrollment found with that ID."));

        Course newCourse = courseService.getCourseById(newCourseId);
        enrollment.setCourse(newCourse);

        try {
            enrollmentRepository.save(enrollment);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("That student is already enrolled in the new course.");
        }
    }

    public void deleteById(Integer enrollmentId) {
        if (!enrollmentRepository.existsById(enrollmentId)) {
            throw new RuntimeException("No enrollment found with that ID.");
        }
        enrollmentRepository.deleteById(enrollmentId);
    }

    public List<Object[]> getEnrollmentCountPerCourse() {
        return enrollmentRepository.countStudentsPerCourse();
    }
}
