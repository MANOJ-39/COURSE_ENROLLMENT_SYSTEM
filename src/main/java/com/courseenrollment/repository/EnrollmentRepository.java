package com.courseenrollment.repository;

import com.courseenrollment.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    Optional<Enrollment> findByStudent_StudentIdAndCourse_CourseId(Integer studentId, Integer courseId);
    List<Enrollment> findByStudent_StudentId(Integer studentId);

    @Query("SELECT new com.courseenrollment.dto.EnrollmentView(e.enrollmentId, s.studentName, c.courseName, e.enrollmentDate) " +
           "FROM Enrollment e JOIN e.student s JOIN e.course c ORDER BY e.enrollmentId")
    List<com.courseenrollment.dto.EnrollmentView> findAllDetailed();

    @Query("SELECT new com.courseenrollment.dto.EnrollmentView(e.enrollmentId, s.studentName, c.courseName, e.enrollmentDate) " +
           "FROM Enrollment e JOIN e.student s JOIN e.course c WHERE e.student.studentId = :studentId ORDER BY e.enrollmentId")
    List<com.courseenrollment.dto.EnrollmentView> findByStudentIdDetailed(@Param("studentId") Integer studentId);

    @Query("SELECT new com.courseenrollment.dto.EnrollmentView(e.enrollmentId, s.studentName, c.courseName, e.enrollmentDate) " +
           "FROM Enrollment e JOIN e.student s JOIN e.course c " +
           "WHERE LOWER(s.studentName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(c.courseName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<com.courseenrollment.dto.EnrollmentView> search(@Param("keyword") String keyword);

    @Query(value = "SELECT c.course_name, COUNT(e.enrollment_id) " +
           "FROM courses c LEFT JOIN course_enrollments e ON c.course_id = e.course_id " +
           "GROUP BY c.course_id, c.course_name " +
           "ORDER BY COUNT(e.enrollment_id) DESC", nativeQuery = true)
    List<Object[]> countStudentsPerCourse();
}
