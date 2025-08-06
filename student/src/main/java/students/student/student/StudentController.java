package students.student.student;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import students.student.JWT.JwtTokenProvider;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequestMapping(path = "/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final StudentRepository studentRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping
    public List<Student> getStudents() {
        return studentService.getStudents();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        Optional<Student> studentByUsername = studentRepository.findStudentByUsername(email);

        System.out.println(email + "  " + password);

        if (studentByUsername.isPresent()) {
            if (studentByUsername.get().getPassword().equals(password))
                return ResponseEntity.ok(Map.of("token", jwtTokenProvider.generateToken(email)));
            else
                return ResponseEntity.ok(Map.of("error", "Invalid credentials"));
        }
        
        return ResponseEntity.ok(Map.of("error", "Username not found"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        Optional<Student> studentByUsername = studentRepository.findStudentByUsername(username);

        System.out.println(username + "  " + password);
        
        if (studentByUsername.isPresent())
            return ResponseEntity.ok(Map.of("error", "Username already exists"));

        if (username.length() < 4)
            return ResponseEntity.ok(Map.of("error", "Username needs to be at least 4 characters"));

        if (password.length() < 8)
            return ResponseEntity.ok(Map.of("error", "Password needs to be at least 8 characters"));

        if (password.length() > 30)
            return ResponseEntity.ok(Map.of("error", "Password needs to be least than 30 characters"));

        studentRepository.save(new Student(username, password));

        return ResponseEntity.ok(Map.of("token", jwtTokenProvider.generateToken(username)));
    }

    /*@DeleteMapping(path = "{studentId}")
    public void deleteStudent(@PathVariable("studentId") long id) {
        studentService.deleteStudent(id);
    }

    @PutMapping(path = "{studentId}")
    public void updateStudent(@PathVariable long studentId,
                              @RequestParam(required = false) String username,
                              @RequestParam(required = false) String password) {
        studentService.updateStudent(studentId, username, password);

    }*/
}
