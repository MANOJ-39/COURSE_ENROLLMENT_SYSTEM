package com.courseenrollment.controller;

import com.courseenrollment.entity.Student;
import com.courseenrollment.security.JwtUtil;
import com.courseenrollment.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private StudentService studentService;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (adminUsername.equals(username) && adminPassword.equals(password)) {
            String token = jwtUtil.generateToken(username, "ADMIN");
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", "ADMIN");
            response.put("username", username);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body("Invalid admin credentials");
    }

    @PostMapping("/student/login")
    public ResponseEntity<?> studentLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Student student = studentService.authenticate(email, password);
        if (student != null) {
            String token = jwtUtil.generateToken(email, "STUDENT");
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", "STUDENT");
            response.put("studentId", student.getStudentId());
            response.put("studentName", student.getStudentName());
            response.put("email", student.getEmail());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body("Invalid email or password");
    }
}
