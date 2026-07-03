package com.courseenrollment.service;

import com.courseenrollment.entity.Student;
import com.courseenrollment.repository.StudentRepository;
import com.courseenrollment.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    public Student addStudent(String name, String email, String plainPassword) {
        Student student = new Student(name, email, PasswordUtil.hash(plainPassword));
        try {
            return studentRepository.save(student);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("A student with that email already exists.");
        }
    }

    public Student authenticate(String email, String plainPassword) {
        return studentRepository.findByEmail(email)
                .filter(s -> s.getPasswordHash().equals(PasswordUtil.hash(plainPassword)))
                .orElse(null);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Integer id) {
        return studentRepository.findById(id).orElse(null);
    }

    public boolean exists(Integer studentId) {
        return studentRepository.existsById(studentId);
    }
}
