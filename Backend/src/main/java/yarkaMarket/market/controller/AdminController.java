package yarkaMarket.market.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import yarkaMarket.market.entity.Conversation;
import yarkaMarket.market.entity.User;
import yarkaMarket.market.repository.ConversationRepository;
import yarkaMarket.market.repository.MessageRepository;
import yarkaMarket.market.repository.UserRepository;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

    public AdminController(UserRepository userRepository,
                           ConversationRepository conversationRepository,
                           MessageRepository messageRepository) {
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalConversations", conversationRepository.count());
        stats.put("messagesToday", messageRepository.countByCreatedAtAfter(ZonedDateTime.now().minusDays(1)));
        return stats;
    }

    // GET /api/admin/users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET /api/admin/conversations
    @GetMapping("/conversations")
    public List<Conversation> getAllConversations() {
        return conversationRepository.findAll();
    }

    @PutMapping("/activate/{id}")
    public ResponseEntity<?> activateUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        User user = userRepository.findById(id).get();
        user.setApproved();
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }
}
