package com.courseenrollment.service;

import com.courseenrollment.entity.Course;
import com.courseenrollment.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    public Course addCourse(String name, Integer credits) {
        return courseRepository.save(new Course(name, credits));
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Integer id) {
        return courseRepository.findById(id).orElse(null);
    }

    public boolean exists(Integer courseId) {
        return courseRepository.existsById(courseId);
    }
}
