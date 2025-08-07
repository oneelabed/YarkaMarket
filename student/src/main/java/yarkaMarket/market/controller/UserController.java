package yarkaMarket.market.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import yarkaMarket.market.JWT.JwtTokenProvider;
import yarkaMarket.market.entity.User.User;
import yarkaMarket.market.repository.UserRepository;
import yarkaMarket.market.service.UserService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequestMapping(path = "/yarkaMarket")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        Optional<User> userByEmail = userRepository.findUserByEmail(email);

        System.out.println(email + "  " + password);

        if (userByEmail.isPresent()) {
            if (userByEmail.get().getPassword().equals(password))
                return ResponseEntity.ok(Map.of("token", jwtTokenProvider.generateToken(email)));
            else
                return ResponseEntity.ok(Map.of("error", "Invalid credentials"));
        }
        
        return ResponseEntity.ok(Map.of("error", "Email not found"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        Optional<User> userByEmail = userRepository.findUserByEmail(email);

        System.out.println(email + "  " + password);
        
        if (userByEmail.isPresent())
            return ResponseEntity.ok(Map.of("error", "Email already exists"));

        if (email.length() < 4)
            return ResponseEntity.ok(Map.of("error", "Email needs to be at least 4 characters"));

        if (password.length() < 8)
            return ResponseEntity.ok(Map.of("error", "Password needs to be at least 8 characters"));

        if (password.length() > 30)
            return ResponseEntity.ok(Map.of("error", "Password needs to be least than 30 characters"));

        userRepository.save(new User(email, password));

        return ResponseEntity.ok(Map.of("token", jwtTokenProvider.generateToken(email)));
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
