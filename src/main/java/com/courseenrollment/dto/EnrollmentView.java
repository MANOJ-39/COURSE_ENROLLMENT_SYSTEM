package com.courseenrollment.dto;

import java.time.LocalDate;

public class EnrollmentView {
    private Integer enrollmentId;
    private String studentName;
    private String courseName;
    private LocalDate enrollmentDate;

    public EnrollmentView() {}

    public EnrollmentView(Integer enrollmentId, String studentName, String courseName, LocalDate enrollmentDate) {
        this.enrollmentId = enrollmentId;
        this.studentName = studentName;
        this.courseName = courseName;
        this.enrollmentDate = enrollmentDate;
    }

    public Integer getEnrollmentId() {
        return enrollmentId;
    }

    public void setEnrollmentId(Integer enrollmentId) {
        this.enrollmentId = enrollmentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public LocalDate getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(LocalDate enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }
}
