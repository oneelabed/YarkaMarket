package yarkaMarket.market.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import yarkaMarket.market.Security.JwtTokenProvider;
import yarkaMarket.market.entity.User;
import yarkaMarket.market.repository.UserRepository;
import yarkaMarket.market.service.PasswordResetService;
import yarkaMarket.market.service.UserService;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetService resetService;


    @GetMapping
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Principal principal) {
        User user = new User();

        if (principal != null) {
            user = userRepository.findUserByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        }

         return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        return userRepository.findUserByEmail(email)
        .map(user -> {
            if (passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.ok(Map.of("token", jwtTokenProvider.generateToken(email)));
            } else {
                return ResponseEntity.ok(Map.of("error", "Invalid credentials"));
            }
        })
        .orElseGet(() -> ResponseEntity.ok(Map.of("error", "Email not found")));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> credentials) {
        String firstName = credentials.get("firstName");
        String lastName = credentials.get("lastName");
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
            return ResponseEntity.ok(Map.of("error", "Password needs to be less than 30 characters"));

        userRepository.save(new User(firstName, lastName, email, passwordEncoder.encode(password)));

        return ResponseEntity.ok(Map.of("token", jwtTokenProvider.generateToken(email)));
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {
        try {
            resetService.createPasswordResetToken(email);
            return "Reset link sent to your email";
        } catch (Exception e) {
            return "Error sending link";
        }
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        try {
            if (newPassword.length() < 8)
                return "Password needs to be at least 8 characters";

            if (newPassword.length() > 30)
                return "Password needs to be less than 30 characters";

            resetService.resetPassword(token, newPassword);
            return "Password successfully updated";
        } catch (Exception e) {
            return "Error reseting password";
        }
    }

    private boolean isValidEmail(String email) {
        if (email == null || email.length() < 6) return false;

        int atIndex = email.indexOf('@');
        if (atIndex == -1 || email.indexOf('@', atIndex + 1) != -1) return false;

        String localPart = email.substring(0, atIndex);
        String domainPart = email.substring(atIndex + 1);

        if (localPart.isEmpty()) return false;

        int dotIndex = domainPart.lastIndexOf('.');
        if (dotIndex == -1 || dotIndex == 0 || dotIndex == domainPart.length() - 1) return false;

        String domainName = domainPart.substring(0, dotIndex);
        String domainExtension = domainPart.substring(dotIndex + 1);

        if (domainName.isEmpty() || domainExtension.length() < 2) return false;

        if (email.contains(" ")) return false;

        return true;
    }
}

