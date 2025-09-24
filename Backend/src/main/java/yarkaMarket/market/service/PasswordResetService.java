package yarkaMarket.market.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import yarkaMarket.market.entity.PasswordResetToken;
import yarkaMarket.market.entity.User;
import yarkaMarket.market.repository.PasswordResetTokenRepository;
import yarkaMarket.market.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.mail.SimpleMailMessage;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private final JavaMailSender mailSender;

    public void createPasswordResetToken(String email) throws Exception {
        User user = userRepository.findUserByEmail(email)
                      .orElseThrow(() -> new Exception("User not found"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1)); // valid for 1 hour

        tokenRepository.save(resetToken);

        sendResetEmail(user.getEmail(), token);
    }

    private void sendResetEmail(String email, String token) {
        String link = "https://yarkamarket.org/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Yarka Market - Password Reset");
        message.setText("Click the link to reset your password: " + link);

        mailSender.send(message);
    }

    public void resetPassword(String token, String newPassword) throws Exception {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
            .orElseThrow(() -> new Exception("Invalid token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new Exception("Token expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }
}

