package yarkaMarket.market.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import yarkaMarket.market.entity.User;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {
    @Autowired
    private final JavaMailSender mailSender;
    private final Map<Long, LocalDateTime> lastNotified = new HashMap<>();

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendNewMessageNotification(User recipient, User sender, String messagePreview, Long conversationId) {
        LocalDateTime now = LocalDateTime.now();

        if (lastNotified.containsKey(recipient.getId())) {
            LocalDateTime last = lastNotified.get(recipient.getId());
            if (last.isAfter(now.minusMinutes(5))) {
                return;
            }
        }

        lastNotified.put(recipient.getId(), now);

        String subject = "New message from " + sender.getFirstName();
        String text = "Hi " + recipient.getFirstName() + ",\n\n"
                + "You received a new message from " + sender.getFirstName() + ":\n\n"
                + "\"" + messagePreview + "\"\n\n"
                + "Reply here: https://yarkamarket.org/dashboard/conversations?convId=" + conversationId + "\n\n"
                + "-- Yarka Market Team";

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(recipient.getEmail());
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (MailException e) {
            System.err.println("Failed to send email to " + recipient.getEmail() + ": " + e.getMessage());
        }
    }
}
