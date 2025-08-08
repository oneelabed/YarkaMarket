package yarkaMarket.market.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import yarkaMarket.market.Security.JwtTokenProvider;
import yarkaMarket.market.entity.User;
import yarkaMarket.market.repository.UserRepository;
import yarkaMarket.market.service.UserService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequestMapping
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
        String firstName = credentials.get("firstName");
        String lastName = credentials.get("lastName");
        String phone = credentials.get("phone");
        String email = credentials.get("email");
        String password = credentials.get("password");
        Optional<User> userByEmail = userRepository.findUserByEmail(email);

        if (!isValidEmail(email))
            return ResponseEntity.ok(Map.of("error", "Invalid email"));

        if (userByEmail.isPresent())
            return ResponseEntity.ok(Map.of("error", "A user with this email already exists"));

        if (password.length() < 8)
            return ResponseEntity.ok(Map.of("error", "Password needs to be at least 8 characters"));

        if (password.length() > 30)
            return ResponseEntity.ok(Map.of("error", "Password needs to be least than 30 characters"));

        userRepository.save(new User(firstName, lastName, phone, email, password));

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

    private boolean isValidEmail(String email) {
        // Basic null or length check
        if (email == null || email.length() < 6) return false;

        // Must contain exactly one '@'
        int atIndex = email.indexOf('@');
        if (atIndex == -1 || email.indexOf('@', atIndex + 1) != -1) return false;

        // Split local and domain parts
        String localPart = email.substring(0, atIndex);
        String domainPart = email.substring(atIndex + 1);

        // Local part must not be empty
        if (localPart.isEmpty()) return false;

        // Domain part must contain at least one '.'
        int dotIndex = domainPart.lastIndexOf('.');
        if (dotIndex == -1 || dotIndex == 0 || dotIndex == domainPart.length() - 1) return false;

        // Domain name and extension must not be empty
        String domainName = domainPart.substring(0, dotIndex);
        String domainExtension = domainPart.substring(dotIndex + 1);

        if (domainName.isEmpty() || domainExtension.length() < 2) return false;

        // No spaces allowed
        if (email.contains(" ")) return false;

        return true;
    }
}

